import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-cursor-home-collapse-selection'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `abcde`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 1, 0, 4]))

  await Editor.cursorHome()

  await Editor.shouldHaveSelections(new Uint32Array([0, 1, 0, 1]))
}
