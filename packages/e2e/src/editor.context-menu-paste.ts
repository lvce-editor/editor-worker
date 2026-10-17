import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.context-menu-paste'

export const skip = 1

export const test: Test = async ({ ClipBoard, ContextMenu, Editor, FileSystem, Main, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  await ClipBoard.writeText('xyz')
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'abc')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 0)

  // act
  await Editor.openEditorContextMenu()
  await ContextMenu.selectItem('Paste')

  // assert
  await Editor.shouldHaveText('xyzabc')
}
