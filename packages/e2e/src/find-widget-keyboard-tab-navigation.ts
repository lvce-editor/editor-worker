import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-keyboard-tab-navigation'

export const skip = 1

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, KeyBoard, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'alpha beta alpha')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.openFind()
  await FindWidget.setValue('alpha')

  const toggleReplace = Locator('.FindWidget [name="ToggleReplace"]')
  const findInput = Locator('.FindWidget [name="search-value"]')
  const replaceInput = Locator('.FindWidget [name="replace-value"]')
  const matchCase = Locator('.FindWidget [name="MatchCase"]')
  const matchWholeWord = Locator('.FindWidget [name="MatchWholeWord"]')
  const useRegularExpression = Locator('.FindWidget [name="UseRegularExpression"]')
  const preserveCase = Locator('.FindWidget [name="PreserveCase"]')
  const previousMatch = Locator('.FindWidget [name="FocusPrevious"]')
  const nextMatch = Locator('.FindWidget [name="FocusNext"]')
  const close = Locator('.FindWidget [name="Close"]')
  const replace = Locator('.FindWidget [name="Replace"]')
  const replaceAll = Locator('.FindWidget [name="ReplaceAll"]')
  const matchCount = Locator('.FindWidgetMatchCount')

  await expect(findInput).toBeFocused()
  await expect(matchCount).toHaveText('1 of 2')
  await expect(previousMatch).toHaveJSProperty('disabled', false)
  await expect(nextMatch).toHaveJSProperty('disabled', false)

  const collapsedForward = [matchCase, matchWholeWord, useRegularExpression, previousMatch, nextMatch, close, toggleReplace, findInput]
  for (const locator of collapsedForward) {
    await KeyBoard.press('Tab')
    await new Promise((resolve) => setTimeout(resolve, 100))
    await expect(locator).toBeFocused()
  }

  const collapsedBackward = [toggleReplace, close, nextMatch, previousMatch, useRegularExpression, matchWholeWord, matchCase, findInput]
  for (const locator of collapsedBackward) {
    await KeyBoard.press('Shift+Tab')
    await new Promise((resolve) => setTimeout(resolve, 100))
    await expect(locator).toBeFocused()
  }

  await FindWidget.toggleReplace()
  await expect(replaceInput).toBeVisible()
  await expect(findInput).toBeFocused()

  const expandedForward = [
    replaceInput,
    matchCase,
    matchWholeWord,
    useRegularExpression,
    preserveCase,
    previousMatch,
    nextMatch,
    close,
    replace,
    replaceAll,
    toggleReplace,
    findInput,
  ]
  for (const locator of expandedForward) {
    await KeyBoard.press('Tab')
    await new Promise((resolve) => setTimeout(resolve, 100))
    await expect(locator).toBeFocused()
  }

  const expandedBackward = [
    toggleReplace,
    replaceAll,
    replace,
    close,
    nextMatch,
    previousMatch,
    preserveCase,
    useRegularExpression,
    matchWholeWord,
    matchCase,
    replaceInput,
    findInput,
  ]
  for (const locator of expandedBackward) {
    await KeyBoard.press('Shift+Tab')
    await new Promise((resolve) => setTimeout(resolve, 100))
    await expect(locator).toBeFocused()
  }
}
