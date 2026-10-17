import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-whole-word-regex'

export const skip = 1

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `test testing tested
retest pretest contest
test123 123test test
the test is a test`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()

  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)
  const matchWholeWordButton = Locator(`.SearchFieldButton[name="MatchWholeWord"]`)
  const useRegularExpressionButton = Locator(`.SearchFieldButton[name="UseRegularExpression"]`)

  // act - enable both regex and whole word
  await FindWidget.toggleUseRegularExpression()
  await FindWidget.toggleMatchWholeWord()
  await FindWidget.setValue('test')

  // assert - both options should be enabled
  await expect(matchWholeWordButton).toHaveAttribute(`aria-checked`, 'true')
  await expect(useRegularExpressionButton).toHaveAttribute(`aria-checked`, 'true')

  // assert - should only match standalone 'test' words
  await expect(findWidgetMatchCount).toBeVisible()
  await expect(findWidgetMatchCount).toHaveText('1 of 4')

  // act - use regex pattern with whole word
  await FindWidget.setValue('test\\d+')

  // assert - should match 'test123' as whole word
  await expect(findWidgetMatchCount).toHaveText('1 of 1')

  // act - use regex alternation with whole word
  await FindWidget.setValue('test|retest')

  // assert - should match 'test' and 'retest' as whole words
  await expect(findWidgetMatchCount).toHaveText('1 of 5')

  // act - disable whole word, keep regex
  await FindWidget.toggleMatchWholeWord()
  await FindWidget.setValue('test')

  // assert - should now match all occurrences of 'test'
  await expect(matchWholeWordButton).toHaveAttribute(`aria-checked`, 'false')
  await expect(findWidgetMatchCount).toHaveText('1 of 10')
}
