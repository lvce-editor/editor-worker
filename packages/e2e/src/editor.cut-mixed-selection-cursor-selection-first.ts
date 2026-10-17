import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.cut-mixed-selection-cursor-selection-first'

export const test: Test = async ({ ClipBoard, Command, Editor, FileSystem, Main, Workspace }) => {
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'alpha beta\ncursor')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 6, 0, 10, 1, 3, 1, 3]))

  await Command.execute('Editor.cut')

  await Editor.shouldHaveText('alpha \ncursor')
  await Editor.shouldHaveSelections(new Uint32Array([0, 6, 0, 6, 1, 3, 1, 3]))
  await ClipBoard.shouldHaveText('beta')
}
