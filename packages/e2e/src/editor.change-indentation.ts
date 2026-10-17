import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.change-indentation'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/file.txt`
  await FileSystem.writeFile(filePath, 'content')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)

  await Command.execute('Editor.setIndentation', false)
  await Editor.setCursor(0, 0)
  await Command.execute('Editor.handleTab')

  await Editor.shouldHaveText('\tcontent')
}
