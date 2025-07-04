import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-cursor-character-left'

// TODO test is flaky
export const skip = 1

export const test: Test = async ({ FileSystem, Workspace, Main, Editor, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)

  // act
  await Editor.setCursor(0, 1)

  // assert
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveCSS('translate', /^(6|7|8|9|10).*?px$/)

  // act
  await Editor.cursorCharacterLeft()

  // assert
  await expect(cursor).toHaveCSS('translate', /^0px$/)
}
