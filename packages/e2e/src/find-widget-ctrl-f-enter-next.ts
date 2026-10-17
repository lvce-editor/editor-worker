import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget.ctrl-f-enter-next'

export const test: Test = async ({ Editor, expect, FileSystem, KeyBoard, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const text = `eventX one
eventX two
eventX three
eventX four
eventX five`
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, text)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)

  await Editor.setSelections(new Uint32Array([0, 0, 0, 6]))
  await KeyBoard.press('Control+f')

  const findWidgetInput = Locator('.FindWidget .MultilineInputBox')
  const findWidgetMatchCount = Locator('.FindWidgetMatchCount')
  await expect(findWidgetInput).toBeFocused()
  await expect(findWidgetInput).toHaveValue('eventX')
  await expect(findWidgetMatchCount).toHaveText('1 of 5')

  await KeyBoard.press('Enter')

  await expect(findWidgetInput).toBeFocused()
  await expect(findWidgetMatchCount).toHaveText('2 of 5')
  await Editor.shouldHaveSelections(new Uint32Array([1, 0, 1, 6]))
  await Editor.shouldHaveText(text)

  await KeyBoard.press('Enter')
  await KeyBoard.press('Enter')
  await KeyBoard.press('Enter')
  await KeyBoard.press('Enter')
  await expect(findWidgetMatchCount).toHaveText('1 of 5')
  await Editor.shouldHaveSelections(new Uint32Array([0, 0, 0, 6]))
  await Editor.shouldHaveText(text)

  await KeyBoard.press('Shift+Enter')
  await expect(findWidgetMatchCount).toHaveText('5 of 5')
  await Editor.shouldHaveSelections(new Uint32Array([4, 0, 4, 6]))
  await Editor.shouldHaveText(text)

  const editorRow = Locator('.EditorRow').first()
  // No test page object exposes editor DOM focus without changing the document.
  // eslint-disable-next-line e2e/no-direct-click
  await editorRow.click()
  await KeyBoard.press('Control+f')
  await expect(findWidgetInput).toBeFocused()
  await expect(findWidgetInput).toHaveValue('eventX')
  await expect(findWidgetMatchCount).toHaveText('5 of 5')

  await KeyBoard.press('Enter')
  await expect(findWidgetMatchCount).toHaveText('1 of 5')
  await Editor.shouldHaveText(text)
}
