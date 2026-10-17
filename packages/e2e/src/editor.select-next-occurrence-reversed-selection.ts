import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-select-next-occurrence-reversed-selection'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/file1.txt`
  await FileSystem.writeFile(uri, 'foo foo\nfoo')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Editor.setSelections(new Uint32Array([0, 3, 0, 0]))

  await Editor.selectNextOccurrence()
  await Editor.shouldHaveSelections(new Uint32Array([0, 3, 0, 0, 0, 4, 0, 7]))
  await Command.execute('Editor.pasteText', 'X')

  await Editor.shouldHaveText('X X\nfoo')
  await Editor.shouldHaveSelections(new Uint32Array([0, 1, 0, 1, 0, 3, 0, 3]))
}
