import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-open-replace'

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
  await Editor.setSelections(new Uint32Array([0, 0, 0, 7]))
  await Editor.openFind()

  // act
  await FindWidget.toggleReplace()

  // assert
  const toggleReplace = Locator('.FindWidget [name="ToggleReplace"]')
  await expect(toggleReplace).toHaveAttribute(`aria-expanded`, `true`)
  const replace = Locator(`.FindWidget .FindWidgetReplace`)
  await expect(replace).toBeVisible()
}
