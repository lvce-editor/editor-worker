import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-case-insensitive-default'

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `Content CONTENT content
CONTENT content Content
content Content CONTENT`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()

  // act - search with lowercase
  await FindWidget.setValue('content')

  // assert - should find all case variations by default
  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)
  await expect(findWidgetMatchCount).toBeVisible()
  await expect(findWidgetMatchCount).toHaveText('1 of 9')

  // assert - match case should be off by default
  const matchCaseButton = Locator(`.SearchFieldButton[name="MatchCase"]`)
  await expect(matchCaseButton).toHaveAttribute(`aria-checked`, 'false')

  // act - search with uppercase
  await FindWidget.setValue('CONTENT')

  // assert - should still find all case variations
  await expect(findWidgetMatchCount).toHaveText('1 of 9')

  // act - search with mixed case
  await FindWidget.setValue('Content')

  // assert - should still find all case variations
  await expect(findWidgetMatchCount).toHaveText('1 of 9')
}
