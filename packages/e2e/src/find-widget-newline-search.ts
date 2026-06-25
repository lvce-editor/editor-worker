import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-newline-search'

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `line 1
line 2
line 3`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()

  // act - search for text that spans multiple lines
  await FindWidget.setValue(`line 1
line 2`)

  // assert - should find the multi-line match
  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)
  await expect(findWidgetMatchCount).toBeVisible()
  await expect(findWidgetMatchCount).toHaveText('1 of 1')

  // act - search for different multi-line pattern
  await FindWidget.setValue(`line 2
line 3`)

  // assert
  await expect(findWidgetMatchCount).toHaveText('1 of 1')
}
