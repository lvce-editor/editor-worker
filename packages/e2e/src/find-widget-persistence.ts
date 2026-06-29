import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-persistence'

export const skip = 1

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
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
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()

  // act - set a search value
  await FindWidget.setValue('content')

  const findWidgetInput = Locator('.FindWidget .MultilineInputBox')
  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)

  // assert - initial state
  await expect(findWidgetInput).toBeVisible()
  await expect(findWidgetInput).toHaveValue('content')
  await expect(findWidgetMatchCount).toHaveText('1 of 3')

  // act - close the find widget
  await FindWidget.close()

  // assert - find widget should be hidden
  const findWidget = Locator('.FindWidget')
  await expect(findWidget).toBeHidden()

  // act - reopen the find widget
  await Editor.openFind()

  // assert - search value should be preserved
  await expect(findWidgetInput).toBeVisible()
  await expect(findWidgetInput).toHaveValue('content')
  await expect(findWidgetMatchCount).toHaveText('1 of 3')

  // act - change the value and close/reopen again
  await FindWidget.setValue('line')
  await FindWidget.close()
  await Editor.openFind()

  // assert - new value should be preserved
  await expect(findWidgetInput).toHaveValue('line')
}
