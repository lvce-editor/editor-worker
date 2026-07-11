import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-keyboard-navigation'

export const skip = 1

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
  await Editor.setSelections(new Uint32Array([0, 0, 0, 7]))
  await Editor.openFind()

  // assert - find input should be focused initially
  const findWidgetInput = Locator('.FindWidget .MultilineInputBox')
  await expect(findWidgetInput).toBeVisible()
  await expect(findWidgetInput).toBeFocused()

  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)
  await expect(findWidgetMatchCount).toHaveText('1 of 3')

  // act - go to next match
  await FindWidget.focusNext()

  // assert - should move to next match
  await expect(findWidgetMatchCount).toHaveText('2 of 3')

  // act - go to previous match
  await FindWidget.focusPrevious()

  // assert - should move back to first match
  await expect(findWidgetMatchCount).toHaveText('1 of 3')

  // act - navigate to next element
  await FindWidget.focusNextElement()

  // assert - match case button should be focused
  const matchCaseButton = Locator(`.SearchFieldButton[name="MatchCase"]`)
  await expect(matchCaseButton).toBeFocused()

  // act - navigate to next element again
  await FindWidget.focusNextElement()

  // assert - match whole word button should be focused
  const matchWholeWordButton = Locator(`.SearchFieldButton[name="MatchWholeWord"]`)
  await expect(matchWholeWordButton).toBeFocused()

  // act - navigate to previous element
  await FindWidget.focusPreviousElement()

  // assert - match case button should be focused again
  await expect(matchCaseButton).toBeFocused()

  // act - toggle match case
  await FindWidget.toggleMatchCase()

  // assert - match case should be enabled
  await expect(matchCaseButton).toHaveAttribute(`aria-checked`, 'true')
}
