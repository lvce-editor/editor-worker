import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-number-search'

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `item 1
item 2
item 10
item 100
item 1000
12345`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()

  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)

  // act - search for single digit
  await FindWidget.setValue('1')

  // assert - should find all occurrences of '1'
  await expect(findWidgetMatchCount).toBeVisible()
  await expect(findWidgetMatchCount).toHaveText('1 of 8')

  // act - search for specific number
  await FindWidget.setValue('100')

  // assert - should find '100' and '1000'
  await expect(findWidgetMatchCount).toHaveText('1 of 2')

  // act - enable whole word matching
  await FindWidget.toggleMatchWholeWord()

  // assert - should only match exact '100'
  await expect(findWidgetMatchCount).toHaveText('1 of 1')

  // act - disable whole word, search for longer number
  await FindWidget.toggleMatchWholeWord()
  await FindWidget.setValue('12345')

  // assert - should find exactly one match
  await expect(findWidgetMatchCount).toHaveText('1 of 1')
}
