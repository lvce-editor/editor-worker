import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget.ctrl-f-refocus'

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, KeyBoard, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'target target target\ntarget target target')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.openFind()
  await FindWidget.setValue('target')

  const findWidget = Locator('.FindWidget:has(.MultilineInputBox:focus)')
  const findWidgetInput = findWidget.locator('.MultilineInputBox')
  const findWidgetMatchCount = findWidget.locator('.FindWidgetMatchCount')
  await expect(findWidgetInput).toHaveValue('target')
  await expect(findWidgetInput).toBeFocused()
  await expect(findWidgetMatchCount).toHaveText('1 of 6')

  const editorInput = Locator('[name="editor"]')
  const editorRow = Locator('.EditorRow').first()
  // No test page object exposes editor DOM focus without changing the document.
  // eslint-disable-next-line e2e/no-direct-click
  await editorRow.click()
  await expect(editorInput).toBeFocused()
  await KeyBoard.press('Control+f')

  await expect(findWidgetInput).toBeFocused()
  await expect(findWidgetInput).toHaveValue('target')
  await expect(findWidgetMatchCount).toHaveText('1 of 6')
}
