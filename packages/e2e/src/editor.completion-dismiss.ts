import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.completion-dismiss'

export const test: Test = async ({ Editor, expect, Extension, FileSystem, KeyBoard, Locator, Main, Workspace }) => {
  const extensionUri = import.meta.resolve('../fixtures/editor.completion-one-result')
  await Extension.addWebExtension(extensionUri)
  const tmpDir = await FileSystem.getTmpDir()
  const firstFile = `${tmpDir}/first.xyz`
  const secondFile = `${tmpDir}/second.xyz`
  await FileSystem.writeFile(firstFile, 'content 1')
  await FileSystem.writeFile(secondFile, 'content 2')
  await Workspace.setPath(tmpDir)
  await Main.openUri(firstFile)
  await Editor.setCursor(0, 0)

  const completions = Locator('.EditorCompletion')
  await Editor.openCompletion()
  await expect(completions).toBeVisible()

  await KeyBoard.press('Escape')

  await expect(completions).toBeHidden()

  await Editor.openCompletion()
  await expect(completions).toBeVisible()

  await Main.openUri(secondFile)

  await expect(completions).toBeHidden()
}
