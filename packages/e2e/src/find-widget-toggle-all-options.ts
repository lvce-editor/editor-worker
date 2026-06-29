import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-toggle-all-options'

export const skip = 1

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `Test testing TESTING
test tested tester
Testing is a test`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()
  await FindWidget.setValue(`test`)

  // assert - initial state, case insensitive partial match
  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)
  await expect(findWidgetMatchCount).toHaveText('1 of 9')

  // act - enable all options
  await FindWidget.toggleMatchCase()
  await FindWidget.toggleMatchWholeWord()
  await FindWidget.toggleUseRegularExpression()

  // assert - all options should be enabled
  const matchCaseButton = Locator(`.SearchFieldButton[name="MatchCase"]`)
  await expect(matchCaseButton).toHaveAttribute(`aria-checked`, 'true')
  const matchWholeWordButton = Locator(`.SearchFieldButton[name="MatchWholeWord"]`)
  await expect(matchWholeWordButton).toHaveAttribute(`aria-checked`, 'true')
  const useRegularExpressionButton = Locator(`.SearchFieldButton[name="UseRegularExpression"]`)
  await expect(useRegularExpressionButton).toHaveAttribute(`aria-checked`, 'true')

  // assert - match count should reflect all options enabled
  await expect(findWidgetMatchCount).toHaveText('1 of 2')

  // act - disable all options
  await FindWidget.toggleMatchCase()
  await FindWidget.toggleMatchWholeWord()
  await FindWidget.toggleUseRegularExpression()

  // assert - all options should be disabled
  await expect(matchCaseButton).toHaveAttribute(`aria-checked`, 'false')
  await expect(matchWholeWordButton).toHaveAttribute(`aria-checked`, 'false')
  await expect(useRegularExpressionButton).toHaveAttribute(`aria-checked`, 'false')

  // assert - match count should be back to original
  await expect(findWidgetMatchCount).toHaveText('1 of 9')
}
