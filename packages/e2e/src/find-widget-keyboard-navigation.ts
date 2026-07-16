import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-keyboard-navigation'

export const test: Test = async ({ Editor, expect, FileSystem, KeyBoard, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `content 1
content 2
content 3`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 7]))
  await Editor.openFind()

  // assert - find input should be focused initially
  const findWidgetInput = Locator('.FindWidget [name="search-value"]:focus')
  await expect(findWidgetInput).toBeVisible()
  await expect(findWidgetInput).toBeFocused()

  const findWidgetMatchCount = Locator(`.FindWidget:has([name="search-value"]:focus) .FindWidgetMatchCount`)
  await expect(findWidgetMatchCount).toHaveText('1 of 3')

  // act - go to next match using the real keyboard path
  await KeyBoard.press('Enter')

  // assert - should move to next match without inserting a line break
  await expect(findWidgetInput).toBeFocused()
  await expect(findWidgetMatchCount).toHaveText('2 of 3')
  await Editor.shouldHaveText(`content 1
content 2
content 3`)
}
