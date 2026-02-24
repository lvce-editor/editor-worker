import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-delete-character-left-join-lines'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `abc\ndef`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(1, 0)

  await Command.execute('Editor.deleteCharacterLeft')

  await Editor.shouldHaveText('abcdef')
}
