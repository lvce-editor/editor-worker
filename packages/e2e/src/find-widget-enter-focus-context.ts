import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-enter-focus-context'

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

  const findWidgetInput = Locator('.FindWidget .MultilineInputBox')
  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)
  await expect(findWidgetInput).toBeFocused()
  await expect(findWidgetInput).toHaveValue('content')
  await expect(findWidgetMatchCount).toHaveText('1 of 3')

  // act
  await KeyBoard.press('Enter')

  // assert
  await expect(findWidgetInput).toBeFocused()
  await expect(findWidgetMatchCount).toHaveText('2 of 3')
  await Editor.shouldHaveText(`content 1
content 2
content 3`)
}
