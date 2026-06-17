import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-undo-redo-sort-lines-ascending'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'gamma\nalpha\nbeta')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 2, 4]))
  await Command.execute('Editor.sortLinesAscending')

  await Editor.undo()
  await Editor.redo()

  await Editor.shouldHaveText('alpha\nbeta\ngamma')
}
