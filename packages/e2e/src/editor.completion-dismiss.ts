import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.completion-dismiss'

export const test: Test = async ({ Editor, expect, Extension, FileSystem, KeyBoard, Locator, Main, Workspace }) => {
  const extensionUri = import.meta.resolve('../fixtures/editor.completion-one-result')
  await Extension.addWebExtension(extensionUri)
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/file.xyz`
  await FileSystem.writeFile(file, 'content')
  await Workspace.setPath(tmpDir)
  await Main.openUri(file)
  await Editor.setCursor(0, 0)

  const completions = Locator('.EditorCompletion')
  await Editor.openCompletion()
  await expect(completions).toBeVisible()

  await KeyBoard.press('Escape')

  await expect(completions).toBeHidden()
}
