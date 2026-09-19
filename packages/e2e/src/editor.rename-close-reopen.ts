import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.rename-close-reopen'

export const test: Test = async ({ Editor, expect, FileSystem, KeyBoard, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/main.js`
  await FileSystem.writeFile(uri, 'const alpha = 1\n')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Editor.setCursor(0, 8)

  // act
  await Editor.openRename()
  const renameWidget = Locator('.EditorRename:has(.RenameInputBox:focus)')
  await expect(renameWidget).toBeVisible()
  await KeyBoard.press('Escape')
  await expect(renameWidget).toBeHidden()
  await Editor.openRename()

  // assert
  await expect(renameWidget).toBeVisible()
}
