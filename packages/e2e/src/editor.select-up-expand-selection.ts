import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-select-up-expand-selection'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `one\ntwo\nthree\nfour\nfive`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([3, 1, 1, 1]))

  await Editor.selectUp()

  await Editor.shouldHaveSelections(new Uint32Array([3, 1, 0, 1]))
}
