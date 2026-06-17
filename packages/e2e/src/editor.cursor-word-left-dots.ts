import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-cursor-word-left-dots'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `this.is.a.test`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 14)

  await Editor.cursorWordLeft()
  await Editor.shouldHaveSelections(new Uint32Array([0, 10, 0, 10]))

  await Editor.cursorWordLeft()
  await Editor.shouldHaveSelections(new Uint32Array([0, 8, 0, 8]))

  await Editor.cursorWordLeft()
  await Editor.shouldHaveSelections(new Uint32Array([0, 5, 0, 5]))

  await Editor.cursorWordLeft()
  await Editor.shouldHaveSelections(new Uint32Array([0, 0, 0, 0]))
}
