import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-delete-character-right-emoji'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `a😀b`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 1)

  await Command.execute('Editor.deleteCharacterRight')

  await Editor.shouldHaveText('ab')
}
