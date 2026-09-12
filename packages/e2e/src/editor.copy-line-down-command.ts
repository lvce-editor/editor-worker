import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-copy-line-down-command'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'one\ntwo')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 3)

  await Editor.copyLineDown()

  await Editor.shouldHaveText('one\none\ntwo')
  await Editor.shouldHaveSelections(new Uint32Array([1, 3, 1, 3]))

  await Editor.setCursor(2, 3)
  await Editor.copyLineDown()

  await Editor.shouldHaveText('one\none\ntwo\ntwo')
  await Editor.shouldHaveSelections(new Uint32Array([3, 3, 3, 3]))
}
