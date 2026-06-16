import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-paste-text-crlf-normalizes-line-breaks'

export const skip = 1

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, '')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 0)

  await Command.execute('Editor.pasteText', 'a\r\nb')

  await Editor.shouldHaveText('a\nb')
}
