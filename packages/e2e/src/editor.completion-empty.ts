import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.completion-empty'

export const skip = 1

export const test: Test = async ({ Editor, expect, Extension, FileSystem, Locator, Main, Workspace }) => {
  const extensionUri = import.meta.resolve('../fixtures/editor.completion-empty')
  await Extension.addWebExtension(extensionUri)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.xyz`, '')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.xyz`)
  await Editor.setCursor(0, 0)

  await Editor.openCompletion()

  const completions = Locator('.EditorCompletion')
  await expect(completions).toBeVisible()
  await expect(completions).toContainText('No Results')
}
