import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-cursor-position-emoji'

export const test: Test = async ({ FileSystem, Workspace, Main, Editor, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, '👮🏽‍♀️👮🏽‍♀️👮🏽‍♀️👮🏽‍♀️👮🏽‍♀️')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)

  // act
  await Editor.setCursor(0, 14)

  // TODO check visual positions
  // assert
  await Editor.shouldHaveSelections(new Uint32Array([0, 14, 0, 14]))
}
