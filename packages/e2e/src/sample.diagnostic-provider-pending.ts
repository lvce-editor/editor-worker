import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.diagnostic-provider-pending'

export const test: Test = async ({ Command, expect, Extension, FileSystem, Locator, Main, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.pending-diagnostics`
  await FileSystem.writeFile(uri, 'visible before diagnostics')
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(import.meta.resolve(`../fixtures/${name}`))
  await Settings.update({ 'editor.diagnostics': true })

  await Main.openUri(uri)

  const editorRow = Locator('.EditorRow', { hasText: 'visible before diagnostics' })
  await expect(editorRow).toBeVisible()

  await Command.executeExtensionCommand('pendingDiagnostics.resolve')

  const diagnostic = Locator('.Diagnostic')
  await expect(diagnostic).toBeVisible()
}
