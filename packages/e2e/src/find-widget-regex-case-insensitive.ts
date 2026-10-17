import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-regex-case-insensitive'

export const skip = 1

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `Hello World
HELLO WORLD
hello world
HeLLo WoRLD`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()
  await FindWidget.toggleUseRegularExpression()

  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)
  const matchCaseButton = Locator(`.SearchFieldButton[name="MatchCase"]`)

  // assert - match case should be off by default
  await expect(matchCaseButton).toHaveAttribute(`aria-checked`, 'false')

  // act - search with regex pattern (case insensitive by default)
  await FindWidget.setValue('hello')

  // assert - should find all case variations
  await expect(findWidgetMatchCount).toBeVisible()
  await expect(findWidgetMatchCount).toHaveText('1 of 4')

  // act - search with regex pattern using character class
  await FindWidget.setValue('[hw]ello')

  // assert - should match 'Hello', 'HELLO', 'hello', 'HeLLo', 'World', 'WORLD', 'world', 'WoRLD'
  await expect(findWidgetMatchCount).toHaveText('1 of 8')

  // act - enable match case
  await FindWidget.toggleMatchCase()

  // assert - should only match lowercase 'hello' and 'world'
  await expect(matchCaseButton).toHaveAttribute(`aria-checked`, 'true')
  await expect(findWidgetMatchCount).toHaveText('1 of 2')

  // act - disable match case again
  await FindWidget.toggleMatchCase()

  // assert - should find all case variations again
  await expect(matchCaseButton).toHaveAttribute(`aria-checked`, 'false')
  await expect(findWidgetMatchCount).toHaveText('1 of 8')

  // act - test regex with alternation case-insensitive
  await FindWidget.setValue('HELLO|world')

  // assert - should match all 'hello' and 'world' regardless of case
  await expect(findWidgetMatchCount).toHaveText('1 of 8')
}
