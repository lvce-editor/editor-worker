import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-undo-redo-copy-line-down'

export const skip = 1

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'one\ntwo')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 1)
  await Editor.copyLineDown()

  await Editor.undo()
  await Editor.redo()

  await Editor.shouldHaveText('one\none\ntwo')
}
