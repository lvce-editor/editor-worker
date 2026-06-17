import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-cursor-word-right-end-of-line'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `line 1\nline 2`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 6)

  await Editor.cursorWordRight()

  await Editor.shouldHaveSelections(new Uint32Array([1, 0, 1, 0]))
}
