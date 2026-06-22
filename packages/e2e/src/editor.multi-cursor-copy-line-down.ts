import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-multi-cursor-copy-line-down'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'one\ntwo\nthree')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 3, 0, 3, 1, 3, 1, 3]))

  await Editor.copyLineDown()

  await Editor.shouldHaveText('one\none\ntwo\ntwo\nthree')
  await Editor.shouldHaveSelections(new Uint32Array([1, 0, 1, 0, 3, 0, 3, 0]))
}
