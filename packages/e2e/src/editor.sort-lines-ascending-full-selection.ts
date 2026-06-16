import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-sort-lines-ascending-full-selection'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'gamma\nalpha\nbeta')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 2, 4]))

  await Command.execute('Editor.sortLinesAscending')

  await Editor.shouldHaveText('alpha\nbeta\ngamma')
}
