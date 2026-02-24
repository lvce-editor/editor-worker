import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.context-menu-format-document'

export const skip = 1

export const test: Test = async ({ ContextMenu, Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'abc')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)

  // act
  await Editor.openEditorContextMenu()
  await ContextMenu.selectItem('Format Document')

  // assert
  const contextMenu = Locator('.ContextMenu')
  await expect(contextMenu).toBeHidden()
}
