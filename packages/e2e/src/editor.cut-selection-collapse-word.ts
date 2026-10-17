import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.cut-selection-collapse-word'

export const test: Test = async ({ ClipBoard, Command, Editor, FileSystem, Main, Workspace }) => {
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'alpha beta gamma')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 6, 0, 10]))

  await Command.execute('Editor.cut')

  await Editor.shouldHaveText('alpha  gamma')
  await Editor.shouldHaveSelections(new Uint32Array([0, 6, 0, 6]))
  await ClipBoard.shouldHaveText('beta')
}
