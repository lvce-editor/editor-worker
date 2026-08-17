import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.diagnostic-provider-pending'

export const test: Test = async ({ Command, Editor, expect, Extension, FileSystem, Locator, Main, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.pending-diagnostics`
  await FileSystem.writeFile(uri, 'visible before diagnostics')
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(import.meta.resolve(`../fixtures/${name}`))
  await Settings.update({ 'editor.diagnostics': true })

  await Main.openUri(uri)

  const editorRow = Locator('.EditorRow', { hasText: 'visible before diagnostics' })
  await expect(editorRow).toBeVisible()

  const diagnosticsRequested = await Command.executeExtensionCommand('pendingDiagnostics.resolve')
  if (!diagnosticsRequested) {
    throw new Error('Expected diagnostics to be requested before resolving the provider')
  }
  // @ts-ignore
  await Editor.shouldHaveDiagnostics([
    {
      columnIndex: 0,
      endColumnIndex: 7,
      endRowIndex: 0,
      message: 'Resolved diagnostic',
      rowIndex: 0,
      type: 'error',
    },
  ])

  const diagnostic = Locator('.Diagnostic')
  await expect(diagnostic).toBeVisible()
}
