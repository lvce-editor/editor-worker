import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-multi-cursor-selection-down'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `line1\nline2\nline3`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 2, 0, 2, 1, 2, 1, 2]))

  await Editor.selectDown()

  await Editor.shouldHaveSelections(new Uint32Array([0, 2, 1, 2, 1, 2, 2, 2]))
}
