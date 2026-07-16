import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.rename-close-clears-highlight'

export const test: Test = async ({ Editor, expect, FileSystem, KeyBoard, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/main.js`
  await FileSystem.writeFile(uri, 'const alpha = 1\n')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Editor.setCursor(0, 8)
  await Editor.openRename()
  const renameWidget = Locator('.EditorRename:has(.RenameInputBox:focus)')
  const renameHighlight = Locator('.Token.EditorRenameHighlight')
  await expect(renameHighlight).toBeVisible()

  // act
  await KeyBoard.press('Escape')

  // assert
  await expect(renameWidget).toBeHidden()
  await expect(renameHighlight).toBeHidden()
}
