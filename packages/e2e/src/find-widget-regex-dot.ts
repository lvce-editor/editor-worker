import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-regex-dot'

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `cat bat hat
car bar far
cap tap map
c.t literal`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()
  await FindWidget.toggleUseRegularExpression()

  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)

  // act - search with dot to match any character
  await FindWidget.setValue('c.t')

  // assert - should match 'cat' and 'c.t' (dot matches any character)
  await expect(findWidgetMatchCount).toBeVisible()
  await expect(findWidgetMatchCount).toHaveText('1 of 2')

  // act - search with multiple dots
  await FindWidget.setValue('c..')

  // assert - should match 'cat', 'car', 'cap'
  await expect(findWidgetMatchCount).toHaveText('1 of 3')

  // act - search with dot at different position
  await FindWidget.setValue('.at')

  // assert - should match 'cat', 'bat', 'hat'
  await expect(findWidgetMatchCount).toHaveText('1 of 3')

  // act - search with multiple dots matching any sequence
  await FindWidget.setValue('c...')

  // assert - should match 4-character words starting with 'c' like 'cat ' or 'c.t '
  await expect(findWidgetMatchCount).toHaveText('1 of 3')

  // act - disable regex to search for literal dot
  await FindWidget.toggleUseRegularExpression()
  await FindWidget.setValue('c.t')

  // assert - should only match literal 'c.t'
  await expect(findWidgetMatchCount).toHaveText('1 of 1')
}
