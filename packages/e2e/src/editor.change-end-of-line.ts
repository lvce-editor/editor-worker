import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.change-end-of-line'

export const test: Test = async ({ Command, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/file.txt`
  await FileSystem.writeFile(filePath, 'first\nsecond\n')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)

  await Command.execute('Editor.setEndOfLine', 'crlf')
  await Main.save()

  await FileSystem.shouldHaveFile(filePath, 'first\r\nsecond\r\n')
}
