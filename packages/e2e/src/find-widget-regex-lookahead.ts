import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-regex-lookahead'

export const skip = 1

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `foo bar
foo baz
bar foo
hello foo world`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()
  await FindWidget.toggleUseRegularExpression()

  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)

  // act - search with positive lookahead (foo followed by space and bar)
  await FindWidget.setValue('foo(?= bar)')

  // assert - should only match 'foo' that is followed by ' bar'
  await expect(findWidgetMatchCount).toBeVisible()
  await expect(findWidgetMatchCount).toHaveText('1 of 1')

  // act - search with negative lookahead (foo NOT followed by space and bar)
  await FindWidget.setValue('foo(?! bar)')

  // assert - should match 'foo' that is not followed by ' bar'
  await expect(findWidgetMatchCount).toHaveText('1 of 3')

  // act - search with positive lookbehind (bar preceded by foo and space)
  await FindWidget.setValue('(?<=foo )bar')

  // assert - should only match 'bar' that is preceded by 'foo '
  await expect(findWidgetMatchCount).toHaveText('1 of 1')

  // act - search with negative lookbehind (bar NOT preceded by foo and space)
  await FindWidget.setValue('(?<!foo )bar')

  // assert - should match 'bar' that is not preceded by 'foo '
  await expect(findWidgetMatchCount).toHaveText('1 of 1')
}
