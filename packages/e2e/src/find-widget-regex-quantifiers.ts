import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-regex-quantifiers'

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `a aa aaa aaaa aaaaa
ab abb abbb abbbb
color colour colouur
test tested testing`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()
  await FindWidget.toggleUseRegularExpression()

  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)

  // act - search with * quantifier (zero or more)
  await FindWidget.setValue('ab*')

  // assert - should match 'a', 'ab', 'abb', 'abbb', 'abbbb', etc.
  await expect(findWidgetMatchCount).toBeVisible()
  await expect(findWidgetMatchCount).toHaveText('1 of 9')

  // act - search with + quantifier (one or more)
  await FindWidget.setValue('ab+')

  // assert - should match 'ab', 'abb', 'abbb', 'abbbb' only
  await expect(findWidgetMatchCount).toHaveText('1 of 4')

  // act - search with ? quantifier (zero or one)
  await FindWidget.setValue('colou?r')

  // assert - should match both 'color' and 'colour'
  await expect(findWidgetMatchCount).toHaveText('1 of 2')

  // act - search with {n} quantifier (exactly n)
  await FindWidget.setValue('a{3}')

  // assert - should match sequences of exactly 3 a's (non-overlapping)
  await expect(findWidgetMatchCount).toHaveText('1 of 2')

  // act - search with {n,} quantifier (n or more)
  await FindWidget.setValue('a{4,}')

  // assert - should match sequences of 4 or more a's
  await expect(findWidgetMatchCount).toHaveText('1 of 2')

  // act - search with {n,m} quantifier (between n and m)
  await FindWidget.setValue('b{2,3}')

  // assert - should match 'bb' and 'bbb' sequences
  await expect(findWidgetMatchCount).toHaveText('1 of 4')

  // act - search with lazy quantifier *?
  await FindWidget.setValue('test.*?ed')

  // assert - should match 'tested' with minimal matching
  await expect(findWidgetMatchCount).toHaveText('1 of 1')

  // act - search with word boundary and quantifier
  await FindWidget.setValue('\\ba{2,}\\b')

  // assert - should match whole words of 2 or more a's
  await expect(findWidgetMatchCount).toHaveText('1 of 4')
}
