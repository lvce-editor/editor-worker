import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-cursor-word-part-left-snake'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `foo_bar`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 7)

  await Editor.cursorWordPartLeft()
  await Editor.shouldHaveSelections(new Uint32Array([0, 4, 0, 4]))

  await Editor.cursorWordPartLeft()
  await Editor.shouldHaveSelections(new Uint32Array([0, 0, 0, 0]))
}
