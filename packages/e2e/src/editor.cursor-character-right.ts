import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-cursor-character-right'

export const test: Test = async ({ FileSystem, Workspace, Main, Editor, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 1)
  await Editor.shouldHaveSelections(new Uint32Array([0, 1, 0, 1]))

  // act
  await Editor.cursorCharacterRight()

  // assert
  await Editor.shouldHaveSelections(new Uint32Array([0, 2, 0, 2]))
}
