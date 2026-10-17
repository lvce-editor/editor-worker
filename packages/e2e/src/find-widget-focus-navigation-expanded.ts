import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-focus-navigation-expanded'

export const skip = 1

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, ``)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()
  const findWidgetInput = Locator('.FindWidget .MultilineInputBox')
  await expect(findWidgetInput).toBeVisible()
  await expect(findWidgetInput).toHaveValue('')
  await expect(findWidgetInput).toBeFocused()

  // act
  await FindWidget.focusNextElement()

  // assert

  // TODO when navgating with replace expanded, after focusing the last
  // input button it should focus the replace element
}
