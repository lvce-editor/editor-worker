import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-focus-navigation-collapsed-no-results-forward'

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, ``)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))

  // act
  await Editor.openFind()

  // assert
  const findWidgetInput = Locator('.FindWidget .MultilineInputBox')
  await expect(findWidgetInput).toBeVisible()
  await expect(findWidgetInput).toHaveValue('')
  await expect(findWidgetInput).toBeFocused()

  // act
  await FindWidget.focusNextElement()

  // assert
  const matchCaseButton = Locator(`.SearchFieldButton[name="MatchCase"]`)
  await expect(matchCaseButton).toBeFocused()

  // act
  await FindWidget.focusNextElement()

  // assert
  const matchWholeWordButton = Locator(`.SearchFieldButton[name="MatchWholeWord"]`)
  await expect(matchWholeWordButton).toBeFocused()

  // act
  await FindWidget.focusNextElement()

  // assert
  const useRegularExpressionButton = Locator(`.SearchFieldButton[name="UseRegularExpression"]`)
  await expect(useRegularExpressionButton).toBeFocused()

  // act
  await FindWidget.focusNextElement()

  // assert
  const closeButton = Locator(`.IconButton[name="Close"]`)
  await expect(closeButton).toBeFocused()
}
