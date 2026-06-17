import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-multi-cursor-word-right'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `one two\nfoo bar`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0, 1, 0, 1, 0]))

  await Editor.cursorWordRight()

  await Editor.shouldHaveSelections(new Uint32Array([0, 3, 0, 3, 1, 3, 1, 3]))
}
