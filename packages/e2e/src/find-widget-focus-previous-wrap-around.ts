import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-focus-previous-wrap-around'

export const skip = 1

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

  // assert - should start at first match
  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)
  await expect(findWidgetMatchCount).toHaveText('1 of 3')

  // act - press previous on first match, should wrap to last
  await FindWidget.focusPrevious()

  // assert - should wrap around to last match
  await expect(findWidgetMatchCount).toHaveText('3 of 3')
  await Editor.shouldHaveSelections(new Uint32Array([2, 0, 2, 7]))
}
