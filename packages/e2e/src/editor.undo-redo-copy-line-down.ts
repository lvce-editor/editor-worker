import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-undo-redo-copy-line-down'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'one\ntwo')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 1)
  await Editor.copyLineDown()

  await Editor.shouldHaveSelections(new Uint32Array([1, 1, 1, 1]))

  await Editor.undo()
  await Editor.shouldHaveText('one\ntwo')
  await Editor.shouldHaveSelections(new Uint32Array([0, 1, 0, 1]))
  await Editor.redo()

  await Editor.shouldHaveText('one\none\ntwo')
  await Editor.shouldHaveSelections(new Uint32Array([1, 1, 1, 1]))
}
