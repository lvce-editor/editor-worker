import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-regex-character-classes'

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `abc 123 def 456
hello_world test123
   spaces   tabs	here
UPPER lower MiXeD`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()
  await FindWidget.toggleUseRegularExpression()

  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)

  // act - search for digits with \d+
  await FindWidget.setValue('\\d+')

  // assert - should find all digit sequences
  await expect(findWidgetMatchCount).toBeVisible()
  await expect(findWidgetMatchCount).toHaveText('1 of 3')

  // act - search for word characters with \w+
  await FindWidget.setValue('\\w+')

  // assert - should find all word sequences
  await expect(findWidgetMatchCount).toHaveText('1 of 12')

  // act - search for whitespace with \s+
  await FindWidget.setValue('\\s+')

  // assert - should find all whitespace sequences
  await expect(findWidgetMatchCount).toHaveText('1 of 10')

  // act - search for lowercase letters only with [a-z]+
  await FindWidget.setValue('[a-z]+')

  // assert - should find lowercase letter sequences
  await expect(findWidgetMatchCount).toHaveText('1 of 12')

  // act - search for uppercase letters only with [A-Z]+
  await FindWidget.setValue('[A-Z]+')

  // assert - should find uppercase letter sequences
  await expect(findWidgetMatchCount).toHaveText('1 of 3')

  // act - search for non-digits with \D+
  await FindWidget.setValue('\\D+')

  // assert - should find all non-digit sequences
  await expect(findWidgetMatchCount).toHaveText('1 of 4')

  // act - search for specific character range [a-f0-3]+
  await FindWidget.setValue('[a-f0-3]+')

  // assert - should find matching sequences
  await expect(findWidgetMatchCount).toHaveText('1 of 7')

  // act - search for negated character class [^a-z]+
  await FindWidget.setValue('[^a-z]+')

  // assert - should find sequences without lowercase letters
  await expect(findWidgetMatchCount).toHaveText('1 of 12')
}
