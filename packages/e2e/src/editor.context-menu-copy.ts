import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.context-menu-copy'

export const skip = 1

export const test: Test = async ({ ClipBoard, ContextMenu, Editor, FileSystem, Main, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'abc')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 3]))

  // act
  await Editor.openEditorContextMenu()
  await ContextMenu.selectItem('Copy')

  // assert
  await Editor.shouldHaveText('abc')
  await ClipBoard.shouldHaveText('abc')
}
