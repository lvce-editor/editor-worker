import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-regex-overlapping'

export const skip = 1

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `aaa
abab
aaaaa`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()
  await FindWidget.toggleUseRegularExpression()

  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)

  // act - search for 'aa' pattern (non-overlapping matches)
  await FindWidget.setValue('aa')

  // assert - regex matches are non-overlapping, so 'aaa' gives 1 match, 'aaaaa' gives 2 matches
  await expect(findWidgetMatchCount).toBeVisible()
  await expect(findWidgetMatchCount).toHaveText('1 of 3')

  // act - search for 'a+' pattern (greedy match)
  await FindWidget.setValue('a+')

  // assert - greedy match should find entire runs of 'a's
  await expect(findWidgetMatchCount).toHaveText('1 of 2')

  // act - search for pattern that could overlap in 'abab'
  await FindWidget.setValue('ab')

  // assert - should find 2 non-overlapping 'ab' matches in 'abab'
  await expect(findWidgetMatchCount).toHaveText('1 of 2')

  // act - search for 'aba' which could theoretically overlap in 'abab'
  await FindWidget.setValue('aba')

  // assert - regex doesn't backtrack for overlapping, so only 1 match
  await expect(findWidgetMatchCount).toHaveText('1 of 1')
}
