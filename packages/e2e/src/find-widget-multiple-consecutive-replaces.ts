import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-multiple-consecutive-replaces'

export const skip = 1

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `old value
old value
old value
old value
old value`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 3]))
  await Editor.openFind()
  await FindWidget.setValue('old')
  await FindWidget.toggleReplace()
  await FindWidget.setReplaceValue('new')

  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)
  await expect(findWidgetMatchCount).toHaveText('1 of 5')

  // act - perform multiple consecutive replaces
  await FindWidget.replace()
  await expect(findWidgetMatchCount).toHaveText('1 of 4')

  await FindWidget.replace()
  await expect(findWidgetMatchCount).toHaveText('1 of 3')

  await FindWidget.replace()
  await expect(findWidgetMatchCount).toHaveText('1 of 2')

  await FindWidget.replace()
  await expect(findWidgetMatchCount).toHaveText('1 of 1')

  await FindWidget.replace()
  await expect(findWidgetMatchCount).toHaveText('No Results')

  // assert - all occurrences should be replaced
  await Editor.shouldHaveText(`new value
new value
new value
new value
new value`)

  // act - try to replace when no results
  await FindWidget.replace()

  // assert - should still show no results and text unchanged
  await expect(findWidgetMatchCount).toHaveText('No Results')
  await Editor.shouldHaveText(`new value
new value
new value
new value
new value`)
}
