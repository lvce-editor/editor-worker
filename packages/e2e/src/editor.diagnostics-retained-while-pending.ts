import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.diagnostics-retained-while-pending'

const waitForPendingRequest = async (Command: { executeExtensionCommand: (command: string) => Promise<unknown> }, stage: string): Promise<void> => {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (Number(await Command.executeExtensionCommand('retainedDiagnostics.pendingCount')) > 0) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 10))
  }
  throw new Error(`Timed out waiting for ${stage} slow diagnostics request`)
}

export const test: Test = async ({ Command, Editor, Extension, FileSystem, Main, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/retained-diagnostics.retained-diagnostics`
  await FileSystem.writeFile(uri, 'visible before diagnostics\nsecond line')
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(import.meta.resolve('../fixtures/editor.diagnostics-retained-fast'))
  await Extension.addWebExtension(import.meta.resolve('../fixtures/editor.diagnostics-retained-slow'))
  await Settings.update({ 'editor.diagnostics': true })
  await Main.openUri(uri)

  await waitForPendingRequest(Command, 'initial')
  await Command.executeExtensionCommand('retainedDiagnostics.resolveSlow')
  await Editor.shouldHaveDiagnostics([
    { columnIndex: 0, endColumnIndex: 26, endRowIndex: 0, message: 'Fast visible before diagnostics\nsecond line', rowIndex: 0, type: 'warning' },
    { columnIndex: 0, endColumnIndex: 6, endRowIndex: 1, message: 'Slow 1', rowIndex: 1, type: 'error' },
  ])

  await Editor.setCursor(1, 0)
  await Editor.type('x')
  await Editor.shouldHaveText('visible before diagnostics\nxsecond line')
  await waitForPendingRequest(Command, 'edited')
  await Editor.shouldHaveDiagnostics([
    { columnIndex: 0, endColumnIndex: 26, endRowIndex: 0, message: 'Fast visible before diagnostics\nxsecond line', rowIndex: 0, type: 'warning' },
    { columnIndex: 0, endColumnIndex: 6, endRowIndex: 1, message: 'Slow 1', rowIndex: 1, type: 'error' },
  ])

  await Command.executeExtensionCommand('retainedDiagnostics.resolveSlow')
  await Editor.shouldHaveDiagnostics([
    { columnIndex: 0, endColumnIndex: 26, endRowIndex: 0, message: 'Fast visible before diagnostics\nxsecond line', rowIndex: 0, type: 'warning' },
    { columnIndex: 0, endColumnIndex: 6, endRowIndex: 1, message: 'Slow 2', rowIndex: 1, type: 'error' },
  ])
}
