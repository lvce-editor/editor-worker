import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.crlf-line-end-editing'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/file.txt`
  await FileSystem.writeFile(filePath, 'first\r\nsecond\r\n')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Editor.setCursor(0, 0)

  await Editor.cursorEnd()

  await Editor.shouldHaveSelections(new Uint32Array([0, 5, 0, 5]))

  await Editor.type('Q')
  await Main.save()

  await FileSystem.shouldHaveFile(filePath, 'firstQ\r\nsecond\r\n')
}
