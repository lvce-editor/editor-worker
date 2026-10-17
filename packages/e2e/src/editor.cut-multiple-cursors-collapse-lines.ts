import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.cut-multiple-cursors-collapse-lines'

export const test: Test = async ({ ClipBoard, Command, Editor, FileSystem, Main, Workspace }) => {
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'one\ntwo\nthree')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 1, 0, 1, 2, 1, 2, 1]))

  await Command.execute('Editor.cut')

  await Editor.shouldHaveText('\ntwo\n')
  await Editor.shouldHaveSelections(new Uint32Array([0, 0, 0, 0, 2, 0, 2, 0]))
  await ClipBoard.shouldHaveText('one\nthree')
}
