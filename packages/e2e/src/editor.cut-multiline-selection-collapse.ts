import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.cut-multiline-selection-collapse'

export const test: Test = async ({ ClipBoard, Command, Editor, FileSystem, Main, Workspace }) => {
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'alpha\nbeta\ngamma')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 2, 1, 2]))

  await Command.execute('Editor.cut')

  await Editor.shouldHaveText('alta\ngamma')
  await Editor.shouldHaveSelections(new Uint32Array([0, 2, 0, 2]))
  await ClipBoard.shouldHaveText('pha\nbe')
}
