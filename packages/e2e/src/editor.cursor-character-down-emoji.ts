import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-cursor-character-down-emoji'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, '👮🏽‍♀️👮🏽‍♀️👮🏽‍♀️👮🏽‍♀️👮🏽‍♀️\nabcde')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 14)
  await Editor.shouldHaveSelections(new Uint32Array([0, 14, 0, 14]))

  // act
  await Editor.cursorDown()

  // assert
  await Editor.shouldHaveSelections(new Uint32Array([1, 14, 1, 14])) // TODO
}
