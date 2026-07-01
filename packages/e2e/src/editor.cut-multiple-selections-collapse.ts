import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.cut-multiple-selections-collapse'

export const test: Test = async ({ ClipBoard, Command, Editor, FileSystem, Main, Workspace }) => {
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'one alpha\ntwo beta\nthree gamma')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 4, 0, 9, 1, 4, 1, 8]))

  await Command.execute('Editor.cut')

  await Editor.shouldHaveText('one \ntwo \nthree gamma')
  await Editor.shouldHaveSelections(new Uint32Array([0, 4, 0, 4, 1, 4, 1, 4]))
  await ClipBoard.shouldHaveText('alpha\nbeta')
}
