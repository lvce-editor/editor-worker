import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-type'

export const skip = 1

export const test: Test = async ({ FileSystem, Workspace, Main, Editor }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `abc`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 3)

  // act
  await Editor.type('def')

  // assert
  await Editor.shouldHaveText('abcdef')
}
