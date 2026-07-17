import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget.ctrl-f-refocus'

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, KeyBoard, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'target target target\ntarget target target')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.openFind()
  await FindWidget.setValue('target')

  const findWidgetInput = Locator('.FindWidget .MultilineInputBox')
  const findWidgetMatchCount = Locator('.FindWidgetMatchCount')
  await expect(findWidgetInput).toHaveValue('target')
  await expect(findWidgetInput).toBeFocused()
  await expect(findWidgetMatchCount).toHaveText('1 of 6')

  const editorInput = Locator('[name="editor"]')
  await editorInput.type('')
  await expect(findWidgetInput).not.toBeFocused()
  await KeyBoard.press('Control+f')

  await expect(findWidgetInput).toBeFocused()
  await expect(findWidgetInput).toHaveValue('target')
  await expect(findWidgetMatchCount).toHaveText('1 of 6')
}
