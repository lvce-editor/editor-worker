import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-delete-horizontal-right'

export const skip = 1

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `abc`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 1)

  // act
  await Command.execute('Editor.deleteHorizontalRight')

  // assert
  await Editor.shouldHaveText('ac')
}
