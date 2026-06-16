import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-copy-line-up-selection'

export const skip = 1

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'one\ntwo\nthree\nfour')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([1, 1, 2, 1]))

  await Editor.copyLineUp()

  await Editor.shouldHaveText('one\ntwo\nthree\ntwo\nthree\nfour')
  await Editor.shouldHaveSelections(new Uint32Array([1, 1, 2, 1]))
}
