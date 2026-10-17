import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-cursor-word-right-dots'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `this.is.a.test`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 0)

  await Editor.cursorWordRight()
  await Editor.shouldHaveSelections(new Uint32Array([0, 4, 0, 4]))

  await Editor.cursorWordRight()
  await Editor.shouldHaveSelections(new Uint32Array([0, 7, 0, 7]))

  await Editor.cursorWordRight()
  await Editor.shouldHaveSelections(new Uint32Array([0, 9, 0, 9]))

  await Editor.cursorWordRight()
  await Editor.shouldHaveSelections(new Uint32Array([0, 14, 0, 14]))
}
