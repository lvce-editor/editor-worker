import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-regex-word-boundaries'

export const skip = 1

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `test testing tested
retest pretest contest
test-case test_case testCase
the test is a test`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()
  await FindWidget.toggleUseRegularExpression()

  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)

  // act - search for 'test' with word boundary at start
  await FindWidget.setValue('\\btest')

  // assert - should match 'test' at word start (not 'retest', 'pretest', 'contest')
  await expect(findWidgetMatchCount).toBeVisible()
  await expect(findWidgetMatchCount).toHaveText('1 of 9')

  // act - search for 'test' with word boundary at end
  await FindWidget.setValue('test\\b')

  // assert - should match 'test' at word end (not 'testing', 'tested', 'testCase')
  await expect(findWidgetMatchCount).toHaveText('1 of 8')

  // act - search for 'test' as complete word with both boundaries
  await FindWidget.setValue('\\btest\\b')

  // assert - should only match standalone 'test'
  await expect(findWidgetMatchCount).toHaveText('1 of 4')

  // act - search for words starting with 'test' and ending with 'ed'
  await FindWidget.setValue('\\btest\\w*ed\\b')

  // assert - should match 'tested'
  await expect(findWidgetMatchCount).toHaveText('1 of 1')

  // act - search for 'test' followed by non-word character
  await FindWidget.setValue('test\\B')

  // assert - should match 'test' NOT at word boundary (like 'testing', 'tested', 'testCase')
  await expect(findWidgetMatchCount).toHaveText('1 of 4')

  // act - search for words ending in 'test'
  await FindWidget.setValue('\\w+test\\b')

  // assert - should match 'retest', 'pretest', 'contest'
  await expect(findWidgetMatchCount).toHaveText('1 of 3')
}
