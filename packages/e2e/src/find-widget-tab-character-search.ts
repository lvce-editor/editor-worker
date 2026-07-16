import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-tab-character-search'

export const skip = 1

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `column1\tcolumn2\tcolumn3
row1\tdata1\tdata2
row2\tdata3\tdata4`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()

  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)

  // act - search for tab character
  await FindWidget.setValue('\t')

  // assert - should find all tab characters (6 total, 2 per line)
  await expect(findWidgetMatchCount).toBeVisible()
  await expect(findWidgetMatchCount).toHaveText('1 of 6')

  // act - search for text with tab
  await FindWidget.setValue('column1\tcolumn2')

  // assert - should find the exact match with tab
  await expect(findWidgetMatchCount).toHaveText('1 of 1')

  // act - search for tab followed by word
  await FindWidget.setValue('\tdata')

  // assert - should find all occurrences of tab followed by 'data'
  await expect(findWidgetMatchCount).toHaveText('1 of 4')
}
