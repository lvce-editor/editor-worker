import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-copy-line-up-command'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'one\ntwo')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(1, 1)

  await Command.execute('Editor.copyLineUp')

  await Editor.shouldHaveText('one\ntwo\ntwo')
}
