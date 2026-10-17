import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-multi-line-input'

export const skip = 1

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `a
b
c`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 7]))
  await Editor.openFind()

  // act
  await FindWidget.setValue(`a
b
c`)

  // assert
  const input = Locator('.FindWidget [name="search-value"]')
  await expect(input).toBeVisible()
  // await expect(input).toHaveCSS('height', '60px') // TODO
}
