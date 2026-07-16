import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-multi-cursor-delete-word-left-over-space'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'foo bar\nbaz qux')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 4, 0, 4, 1, 4, 1, 4]))

  await Editor.deleteWordLeft()

  await Editor.shouldHaveText('bar\nqux')
  await Editor.shouldHaveSelections(new Uint32Array([0, 0, 0, 0, 1, 0, 1, 0]))
}
