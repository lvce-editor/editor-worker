import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-select-down-bottom-boundary'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `one\ntwo\nthree\nfour\nfive`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([1, 1, 4, 1]))

  await Editor.selectDown()

  await Editor.shouldHaveSelections(new Uint32Array([1, 1, 4, 1]))
}
