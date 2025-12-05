import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-cursor-up'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `content 1
content 2`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)

  // act
  await Editor.setCursor(1, 1)

  // assert
  await Editor.shouldHaveSelections(new Uint32Array([1, 1, 1, 1]))

  // act
  await Editor.cursorUp()

  // assert
  await Editor.shouldHaveSelections(new Uint32Array([0, 1, 0, 1]))
}
