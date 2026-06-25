import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-long-search-string'

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const longString = 'a'.repeat(500)
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `short text
${longString}
another line
${longString}
end of file`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()

  // act - search for the very long string
  await FindWidget.setValue(longString)

  // assert - should find both occurrences of the long string
  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)
  await expect(findWidgetMatchCount).toBeVisible()
  await expect(findWidgetMatchCount).toHaveText('1 of 2')

  // act - navigate to next match
  await FindWidget.focusNext()

  // assert - should move to second match
  await expect(findWidgetMatchCount).toHaveText('2 of 2')

  // act - search for partial long string (first half)
  const partialString = 'a'.repeat(250)
  await FindWidget.setValue(partialString)

  // assert - should still find matches
  await expect(findWidgetMatchCount).toHaveText('1 of 2')
}
