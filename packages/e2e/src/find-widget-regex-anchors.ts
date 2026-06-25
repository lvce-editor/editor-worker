import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-regex-anchors'

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `hello world
world hello
hello hello
world world`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()
  await FindWidget.toggleUseRegularExpression()

  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)

  // act - search for 'hello' at start of line
  await FindWidget.setValue('^hello')

  // assert - should only match 'hello' at the beginning of lines
  await expect(findWidgetMatchCount).toBeVisible()
  await expect(findWidgetMatchCount).toHaveText('1 of 2')

  // act - search for 'world' at end of line
  await FindWidget.setValue('world$')

  // assert - should only match 'world' at the end of lines
  await expect(findWidgetMatchCount).toHaveText('1 of 2')

  // act - search for 'hello' at end of line
  await FindWidget.setValue('hello$')

  // assert - should only match 'hello' at the end of lines
  await expect(findWidgetMatchCount).toHaveText('1 of 2')

  // act - search for 'world' at start of line
  await FindWidget.setValue('^world')

  // assert - should only match 'world' at the beginning of lines
  await expect(findWidgetMatchCount).toHaveText('1 of 2')

  // act - search for entire line pattern
  await FindWidget.setValue('^hello world$')

  // assert - should match exactly the first line
  await expect(findWidgetMatchCount).toHaveText('1 of 1')

  // act - search for line starting and ending with same word
  await FindWidget.setValue('^(\\w+).*\\1$')

  // assert - should match lines where first and last word are the same
  await expect(findWidgetMatchCount).toHaveText('1 of 2')

  // act - search for start of line followed by any content
  await FindWidget.setValue('^.*hello')

  // assert - should match lines containing 'hello'
  await expect(findWidgetMatchCount).toHaveText('1 of 3')
}
