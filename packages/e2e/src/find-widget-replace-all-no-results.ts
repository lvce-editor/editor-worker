import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-replace-all-no-results'

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
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()
  await FindWidget.setValue('nonexistent-text')
  await FindWidget.toggleReplace()
  await FindWidget.setReplaceValue('replacement')

  // assert - should show no results
  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)
  await expect(findWidgetMatchCount).toBeVisible()
  await expect(findWidgetMatchCount).toHaveText('No Results')

  // assert - replace all button should be disabled
  const buttonReplaceAll = Locator('[title="Replace All"]')
  await expect(buttonReplaceAll).toHaveAttribute('disabled', '')

  // act - attempt replace all (should not change anything)
  // Since the button is disabled, we verify the file content remains unchanged
  await Editor.shouldHaveText(`content 1
content 2
content 3`)
}
