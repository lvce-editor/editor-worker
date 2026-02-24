import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-delete-word-part-left-camel'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `myHTTPServer`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 6)

  await Command.execute('Editor.deleteWordPartLeft')

  await Editor.shouldHaveText('myServer')
}
