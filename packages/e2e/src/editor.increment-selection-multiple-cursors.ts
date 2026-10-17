import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.increment-selection-multiple-cursors'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'x = 1\ny = 9\nz = -2')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 4, 0, 4, 1, 4, 1, 4, 2, 5, 2, 5]))

  await Command.execute('Editor.incrementSelection')

  await Editor.shouldHaveText('x = 2\ny = 10\nz = -1')
  await Editor.shouldHaveSelections(new Uint32Array([0, 4, 0, 4, 1, 4, 1, 4, 2, 5, 2, 5]))
}
