import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.delete-all'

export const skip = 1

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `first line\nsecond line\n`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(1, 3)

  // act
  await Command.execute('Editor.deleteAll')

  // assert
  await Editor.shouldHaveText('')
}
