import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-match-case-whole-word'

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `Test testing TESTING
test tested tester
Test is a test`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()
  await FindWidget.setValue(`Test`)

  // assert - before enabling options, should find all case-insensitive partial matches
  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)
  await expect(findWidgetMatchCount).toHaveText('1 of 7')

  // act - enable match case
  await FindWidget.toggleMatchCase()

  // assert - should only match "Test" exactly (case-sensitive)
  await expect(findWidgetMatchCount).toHaveText('1 of 3')

  // act - also enable match whole word
  await FindWidget.toggleMatchWholeWord()

  // assert - should only match "Test" as whole word and case-sensitive
  await expect(findWidgetMatchCount).toHaveText('1 of 2')

  const matchCaseButton = Locator(`.SearchFieldButton[name="MatchCase"]`)
  await expect(matchCaseButton).toHaveAttribute(`aria-checked`, 'true')
  const matchWholeWordButton = Locator(`.SearchFieldButton[name="MatchWholeWord"]`)
  await expect(matchWholeWordButton).toHaveAttribute(`aria-checked`, 'true')
}
