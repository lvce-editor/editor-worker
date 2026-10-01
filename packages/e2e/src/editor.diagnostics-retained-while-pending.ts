import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.diagnostics-retained-while-pending'

const waitForPendingRequest = async (Command: { executeExtensionCommand: (command: string) => Promise<unknown> }): Promise<void> => {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (Number(await Command.executeExtensionCommand('retainedDiagnostics.pendingCount')) > 0) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 10))
  }
  throw new Error('Timed out waiting for slow diagnostics request')
}

export const test: Test = async ({ Command, Editor, Extension, FileSystem, Main, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/retained-diagnostics.xyz`
  await FileSystem.writeFile(uri, 'one')
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(import.meta.resolve('../fixtures/editor.diagnostics-retained-while-pending'))
  await Settings.update({ 'editor.diagnostics': true })
  await Main.openUri(uri)

  await waitForPendingRequest(Command)
  await Command.executeExtensionCommand('retainedDiagnostics.resolveSlow')
  await Editor.shouldHaveDiagnostics([
    { columnIndex: 0, endColumnIndex: 3, endRowIndex: 0, message: 'Fast one', rowIndex: 0, type: 'warning' },
    { columnIndex: 0, endColumnIndex: 4, endRowIndex: 0, message: 'Slow 1', rowIndex: 0, type: 'error' },
  ])

  await Editor.setCursor(0, 3)
  await Editor.type(' two')
  await Editor.shouldHaveText('one two')
  await waitForPendingRequest(Command)
  await Editor.shouldHaveDiagnostics([
    { columnIndex: 0, endColumnIndex: 7, endRowIndex: 0, message: 'Fast one two', rowIndex: 0, type: 'warning' },
    { columnIndex: 0, endColumnIndex: 4, endRowIndex: 0, message: 'Slow 1', rowIndex: 0, type: 'error' },
  ])

  await Command.executeExtensionCommand('retainedDiagnostics.resolveSlow')
  await Editor.shouldHaveDiagnostics([
    { columnIndex: 0, endColumnIndex: 7, endRowIndex: 0, message: 'Fast one two', rowIndex: 0, type: 'warning' },
    { columnIndex: 0, endColumnIndex: 4, endRowIndex: 0, message: 'Slow 2', rowIndex: 0, type: 'error' },
  ])
}
