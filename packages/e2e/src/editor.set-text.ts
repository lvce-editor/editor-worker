import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.set-text'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'before')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)

  // act
  await Command.execute('Editor.setText', 'after\nline2')

  // assert
  await Editor.shouldHaveText('after\nline2')
}
