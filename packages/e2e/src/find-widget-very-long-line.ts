import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-very-long-line'

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange - create a file with a very long line
  const tmpDir = await FileSystem.getTmpDir()
  const longPrefix = 'x'.repeat(5000)
  const longSuffix = 'y'.repeat(5000)
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `short line
${longPrefix}needle${longSuffix}
another short line
${longPrefix}needle${longSuffix}
final line`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()

  // act - search for the needle in the very long lines
  await FindWidget.setValue('needle')

  // assert - should find both occurrences in the long lines
  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)
  await expect(findWidgetMatchCount).toBeVisible()
  await expect(findWidgetMatchCount).toHaveText('1 of 2')

  // act - navigate to next match
  await FindWidget.focusNext()

  // assert - should move to second match
  await expect(findWidgetMatchCount).toHaveText('2 of 2')

  // act - search for the repeated character
  await FindWidget.setValue('xxx')

  // assert - should find many matches in the long prefix
  await expect(findWidgetMatchCount).toHaveText('1 of 3332')

  // act - replace needle in long lines
  await FindWidget.setValue('needle')
  await FindWidget.toggleReplace()
  await FindWidget.setReplaceValue('FOUND')
  await FindWidget.replaceAll()

  // assert - both needles should be replaced
  await expect(findWidgetMatchCount).toHaveText('No Results')
}
