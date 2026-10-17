import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-whitespace-search'

export const skip = 1

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `word1 word2
word3  word4
word5   word6`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()

  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)

  // act - search for single space
  await FindWidget.setValue(' ')

  // assert - should find all single spaces (6 total: 1+2+3 spaces across lines)
  await expect(findWidgetMatchCount).toBeVisible()
  await expect(findWidgetMatchCount).toHaveText('1 of 6')

  // act - search for double space
  await FindWidget.setValue('  ')

  // assert - should find consecutive double spaces
  await expect(findWidgetMatchCount).toHaveText('1 of 2')

  // act - search for triple space
  await FindWidget.setValue(' '.repeat(3))

  // assert - should find only the triple space
  await expect(findWidgetMatchCount).toHaveText('1 of 1')

  // act - search for space surrounded by words
  await FindWidget.setValue('word1 word2')

  // assert - should find exact match with single space
  await expect(findWidgetMatchCount).toHaveText('1 of 1')
}
