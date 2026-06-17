import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-multi-cursor-word-left'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `one two\nfoo bar`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 7, 0, 7, 1, 7, 1, 7]))

  await Editor.cursorWordLeft()

  await Editor.shouldHaveSelections(new Uint32Array([0, 4, 0, 4, 1, 4, 1, 4]))
}
