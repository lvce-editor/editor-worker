import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.rename-no-word'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/main.js`
  await FileSystem.writeFile(uri, 'const  alpha = 1\n')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Editor.setCursor(0, 6)

  // act
  await Editor.openRename()

  // assert
  const renameWidget = Locator('.EditorRename:has(.RenameInputBox:focus)')
  await expect(renameWidget).toBeHidden()
  const renameHighlight = Locator('.Token.R')
  await expect(renameHighlight).toBeHidden()
}
