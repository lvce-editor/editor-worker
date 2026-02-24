import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-delete-word-left-over-space'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `foo bar`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 4)

  await Command.execute('Editor.deleteWordLeft')

  await Editor.shouldHaveText('bar')
}
