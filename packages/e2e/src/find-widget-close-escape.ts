import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-close-escape'

export const test: Test = async ({ Editor, expect, FileSystem, KeyBoard, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `content 1
content 2`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 7]))
  await Editor.openFind()

  const findWidget = Locator('.FindWidget:has(.MultilineInputBox:focus)')
  const findWidgetInput = findWidget.locator('.MultilineInputBox')
  await expect(findWidgetInput).toBeVisible()
  await expect(findWidgetInput).toBeFocused()

  // act - close the find widget
  await KeyBoard.press('Escape')

  // assert - find widget should be hidden
  await expect(findWidget).toBeHidden()

  // assert - editor should have focus back
  const editorInput = Locator('.EditorInput textarea')
  await expect(editorInput).toBeFocused()
}
