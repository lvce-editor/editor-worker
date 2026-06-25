import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-single-match'

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `hello world
foo bar
test case`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()

  // act
  await FindWidget.setValue('world')

  // assert - should show exactly 1 of 1
  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)
  await expect(findWidgetMatchCount).toBeVisible()
  await expect(findWidgetMatchCount).toHaveText('1 of 1')

  // act - press next, should stay on same match (wrap around to itself)
  await FindWidget.focusNext()

  // assert - should still be 1 of 1
  await expect(findWidgetMatchCount).toHaveText('1 of 1')

  // act - press previous, should also stay on same match
  await FindWidget.focusPrevious()

  // assert - should still be 1 of 1
  await expect(findWidgetMatchCount).toHaveText('1 of 1')

  // assert - navigation buttons should still be enabled for single match
  const buttonPreviousMatch = Locator('[title="Previous Match"]')
  await expect(buttonPreviousMatch).not.toHaveAttribute('disabled', '')
  const buttonNextMatch = Locator('[title="Next Match"]')
  await expect(buttonNextMatch).not.toHaveAttribute('disabled', '')
}
