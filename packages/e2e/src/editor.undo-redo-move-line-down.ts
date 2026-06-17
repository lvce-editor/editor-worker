import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-undo-redo-move-line-down'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'one\ntwo\nthree')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 0)
  await Command.execute('Editor.moveLineDown')

  await Editor.undo()
  await Editor.redo()

  await Editor.shouldHaveText('two\none\nthree')
}
