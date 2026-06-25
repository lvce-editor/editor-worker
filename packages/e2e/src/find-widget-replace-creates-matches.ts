import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-replace-creates-matches'

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `abc def
ghi jkl`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 3]))
  await Editor.openFind()
  await FindWidget.setValue('abc')
  await FindWidget.toggleReplace()
  // Replace 'abc' with 'abc abc' - this creates a new match
  await FindWidget.setReplaceValue('abc abc')

  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)
  await expect(findWidgetMatchCount).toHaveText('1 of 1')

  // act - replace creates additional matches
  await FindWidget.replace()

  // assert - the replacement created two new 'abc' matches
  await expect(findWidgetMatchCount).toHaveText('1 of 2')
  await Editor.shouldHaveText(`abc abc def
ghi jkl`)

  // act - replace one more time
  await FindWidget.replace()

  // assert - now we have 3 matches (one replaced, creates 2 more)
  await expect(findWidgetMatchCount).toHaveText('1 of 3')
  await Editor.shouldHaveText(`abc abc abc def
ghi jkl`)
}
