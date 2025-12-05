import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-cursor-word-left'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `<title>Document</title>`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 15)
  await Editor.shouldHaveSelections(new Uint32Array([0, 15, 0, 15]))

  // act
  await Editor.cursorWordLeft()

  // assert
  await Editor.shouldHaveSelections(new Uint32Array([0, 7, 0, 7]))
}
