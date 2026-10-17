import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-close-on-editor-close'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/find-widget-close.txt`
  await FileSystem.writeFile(file, 'content')
  await Main.openUri(file)
  await Editor.openFind()
  const findWidget = Locator('.FindWidget')
  await expect(findWidget).toBeVisible()

  // act
  await Main.closeAllEditors()

  // assert
  await expect(findWidget).toBeHidden()
}
