import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-cursor-character-left-emoji'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, '👮🏽‍♀️👮🏽‍♀️👮🏽‍♀️👮🏽‍♀️👮🏽‍♀️')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 14)
  await Editor.shouldHaveSelections(new Uint32Array([0, 14, 0, 14]))

  // act
  await Editor.cursorCharacterLeft()

  // assert
  await Editor.shouldHaveSelections(new Uint32Array([0, 7, 0, 7]))
}
