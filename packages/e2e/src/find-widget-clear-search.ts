import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-clear-search'

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
  await Editor.setSelections(new Uint32Array([0, 0, 0, 7]))
  await Editor.openFind()

  const findWidgetInput = Locator('.FindWidget .MultilineInputBox')
  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)

  // assert - initial state with search value
  await expect(findWidgetInput).toBeVisible()
  await expect(findWidgetInput).toHaveValue('content')
  await expect(findWidgetMatchCount).toHaveText('1 of 3')

  // act - clear the search value
  await FindWidget.setValue('')

  // assert - should show no results with empty search
  await expect(findWidgetInput).toHaveValue('')
  await expect(findWidgetMatchCount).toHaveText('No Results')

  // assert - navigation buttons should be disabled
  const buttonPreviousMatch = Locator('[title="Previous Match"]')
  await expect(buttonPreviousMatch).toHaveAttribute('disabled', '')
  const buttonNextMatch = Locator('[title="Next Match"]')
  await expect(buttonNextMatch).toHaveAttribute('disabled', '')

  // act - type a new search value
  await FindWidget.setValue('content')

  // assert - should find matches again
  await expect(findWidgetMatchCount).toHaveText('1 of 3')
  await expect(buttonPreviousMatch).not.toHaveAttribute('disabled', '')
  await expect(buttonNextMatch).not.toHaveAttribute('disabled', '')
}
