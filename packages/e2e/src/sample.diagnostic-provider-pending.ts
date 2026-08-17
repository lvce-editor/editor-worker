import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.diagnostic-provider-pending'

export const test: Test = async ({ Editor, expect, Extension, FileSystem, Locator, Main, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.pending-diagnostics`
  await FileSystem.writeFile(uri, 'visible before diagnostics')
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(import.meta.resolve(`../fixtures/${name}`))
  await Settings.update({ 'editor.diagnostics': true })

  await Main.openUri(uri)

  const editorRow = Locator('.EditorRow', { hasText: 'visible before diagnostics' })
  await expect(editorRow).toBeVisible()

  const diagnostic = Locator('.Diagnostic')
  await expect(diagnostic).toBeHidden()

  await FileSystem.writeFile(`${uri}.resolve`, '')

  const expectedDiagnostics = [
    {
      columnIndex: 0,
      endColumnIndex: 7,
      endRowIndex: 0,
      message: 'Resolved diagnostic',
      rowIndex: 0,
      type: 'error',
    },
  ]
  let diagnosticsStored = false
  let diagnosticsStorageError: unknown
  for (let attempt = 0; attempt < 200; attempt++) {
    try {
      // @ts-ignore
      await Editor.shouldHaveDiagnostics(expectedDiagnostics)
      diagnosticsStored = true
      break
    } catch (error) {
      diagnosticsStorageError = error
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
  if (!diagnosticsStored) {
    throw diagnosticsStorageError
  }

  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      await expect(diagnostic).toBeVisible()
      return
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
  await expect(diagnostic).toBeVisible()
}
