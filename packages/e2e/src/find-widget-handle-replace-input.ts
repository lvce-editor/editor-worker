import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-handle-replace-input'

export const skip = 1

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `content 1
content 2`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()
  await FindWidget.toggleReplace()

  // act
  await FindWidget.setReplaceValue('abc')

  // assert
  const findWidgetReplaceInput = Locator('.FindWidget [name="replace-value"]')
  await expect(findWidgetReplaceInput).toBeVisible()
  await expect(findWidgetReplaceInput).toHaveValue('abc')
}
