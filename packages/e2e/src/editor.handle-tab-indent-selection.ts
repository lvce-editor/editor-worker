import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-handle-tab-indent-selection'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'one\ntwo\nthree')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 1, 1, 2]))

  await Command.execute('Editor.handleTab')

  await Editor.shouldHaveText('  one\n  two\nthree')
}
