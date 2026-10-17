import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-sort-lines-ascending-partial-selection'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'zeta\ngamma\nalpha\nomega')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([1, 0, 2, 5]))

  await Command.execute('Editor.sortLinesAscending')

  await Editor.shouldHaveText('zeta\nalpha\ngamma\nomega')
}
