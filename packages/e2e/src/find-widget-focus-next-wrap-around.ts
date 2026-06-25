import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-focus-next-wrap-around'

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `content 1
content 2
content 3`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 7]))
  await Editor.openFind()
  await FindWidget.setValue('content')

  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)
  await expect(findWidgetMatchCount).toHaveText('1 of 3')

  // act - navigate to last match
  await FindWidget.focusNext()
  await expect(findWidgetMatchCount).toHaveText('2 of 3')

  await FindWidget.focusNext()
  await expect(findWidgetMatchCount).toHaveText('3 of 3')

  // act - wrap around to first match
  await FindWidget.focusNext()

  // assert - should wrap back to first match
  await expect(findWidgetMatchCount).toHaveText('1 of 3')
  await Editor.shouldHaveSelections(new Uint32Array([0, 0, 0, 7]))
}
