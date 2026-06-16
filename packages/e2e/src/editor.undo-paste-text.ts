import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-undo-paste-text'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'abc')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 1)
  await Command.execute('Editor.pasteText', 'XYZ')

  await Command.execute('Editor.undo')

  await Editor.shouldHaveText('abc')
}
