import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-paste-text-multiline'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'start end')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 6)

  await Command.execute('Editor.pasteText', 'one\ntwo\n')

  await Editor.shouldHaveText('start one\ntwo\nend')
}
