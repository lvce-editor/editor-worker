import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-cursor-word-right'

export const test: Test = async ({ FileSystem, Workspace, Main, Editor }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `<title>Document</title>`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 7)
  await Editor.shouldHaveSelections(new Uint32Array([0, 7, 0, 7]))

  // act
  await Editor.cursorWordRight()

  // assert
  await Editor.shouldHaveSelections(new Uint32Array([0, 15, 0, 15]))
}
