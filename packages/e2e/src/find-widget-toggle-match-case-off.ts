import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-toggle-match-case-off'

export const skip = 1

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `Content 1
content 2
CONTENT 3`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 7]))
  await Editor.openFind()
  await FindWidget.setValue(`content`)

  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)
  const matchCaseButton = Locator(`.SearchFieldButton[name="MatchCase"]`)

  // assert - initially case insensitive, should find all 3
  await expect(findWidgetMatchCount).toHaveText('1 of 3')
  await expect(matchCaseButton).toHaveAttribute(`aria-checked`, 'false')

  // act - enable match case
  await FindWidget.toggleMatchCase()

  // assert - case sensitive, should find only lowercase 'content'
  await expect(matchCaseButton).toHaveAttribute(`aria-checked`, 'true')
  await expect(findWidgetMatchCount).toHaveText('1 of 1')

  // act - disable match case again
  await FindWidget.toggleMatchCase()

  // assert - back to case insensitive, should find all 3 again
  await expect(matchCaseButton).toHaveAttribute(`aria-checked`, 'false')
  await expect(findWidgetMatchCount).toHaveText('1 of 3')
}
