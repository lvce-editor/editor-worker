import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-move-line-up-command'

export const skip = 1

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'one\ntwo\nthree')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(2, 0)

  await Command.execute('Editor.moveLineUp')

  await Editor.shouldHaveText('one\nthree\ntwo')
  await Editor.shouldHaveSelections(new Uint32Array([1, 0, 1, 0]))
}
