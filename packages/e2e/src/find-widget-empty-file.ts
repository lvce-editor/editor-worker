import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-empty-file'

export const skip = 1

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, ``)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()

  // act
  await FindWidget.setValue('content')

  // assert - should show no results for empty file
  const findWidgetInput = Locator('.FindWidget .MultilineInputBox')
  await expect(findWidgetInput).toBeVisible()
  await expect(findWidgetInput).toHaveValue('content')
  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)
  await expect(findWidgetMatchCount).toBeVisible()
  await expect(findWidgetMatchCount).toHaveText('No Results')

  // assert - navigation buttons should be disabled
  const buttonPreviousMatch = Locator('[title="Previous Match"]')
  await expect(buttonPreviousMatch).toHaveAttribute('disabled', '')
  const buttonNextMatch = Locator('[title="Next Match"]')
  await expect(buttonNextMatch).toHaveAttribute('disabled', '')
}
