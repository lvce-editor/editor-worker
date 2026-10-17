import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.cut-mixed-cursor-selection-cursor-first'

export const test: Test = async ({ ClipBoard, Command, Editor, FileSystem, Main, Workspace }) => {
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'cursor\nalpha beta')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 3, 0, 3, 1, 6, 1, 10]))

  await Command.execute('Editor.cut')

  await Editor.shouldHaveText('cursor\nalpha ')
  await Editor.shouldHaveSelections(new Uint32Array([0, 3, 0, 3, 1, 6, 1, 6]))
  await ClipBoard.shouldHaveText('beta')
}
