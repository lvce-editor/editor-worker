import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.rename-no-provider'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/main.txt`
  await FileSystem.writeFile(uri, 'hello world\n')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Editor.setCursor(0, 2)

  // act
  await Editor.openRename()

  // assert
  const renameWidget = Locator('.EditorRename')
  await expect(renameWidget).toBeHidden()
  const renameHighlight = Locator('.Token.R')
  await expect(renameHighlight).toBeHidden()
  const editorInput = Locator('.EditorInput textarea')
  await expect(editorInput).toBeFocused()
  await Editor.shouldHaveText('hello world\n')
}
