import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-regex-alternation'

export const skip = 1

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `apple banana cherry
orange grape apple
cherry banana orange
pear apple grape`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()
  await FindWidget.toggleUseRegularExpression()

  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)

  // act - search for apple OR banana
  await FindWidget.setValue('apple|banana')

  // assert - should find all occurrences of either word
  await expect(findWidgetMatchCount).toBeVisible()
  await expect(findWidgetMatchCount).toHaveText('1 of 5')

  // act - search for three alternatives
  await FindWidget.setValue('apple|banana|cherry')

  // assert - should find all occurrences of any of the three words
  await expect(findWidgetMatchCount).toHaveText('1 of 7')

  // act - search with grouped alternation
  await FindWidget.setValue('(apple|pear)')

  // assert - should find both apple and pear
  await expect(findWidgetMatchCount).toHaveText('1 of 4')

  // act - search with alternation and partial word
  await FindWidget.setValue('ora(nge|l)')

  // assert - should match 'orange' only (oral not present)
  await expect(findWidgetMatchCount).toHaveText('1 of 2')

  // act - alternation with quantifiers
  await FindWidget.setValue('(app|grap)le')

  // assert - should match 'apple' and 'grape'
  await expect(findWidgetMatchCount).toHaveText('1 of 5')

  // act - alternation at word boundaries
  await FindWidget.setValue('\\b(apple|grape)\\b')

  // assert - should match whole words only
  await expect(findWidgetMatchCount).toHaveText('1 of 5')
}
