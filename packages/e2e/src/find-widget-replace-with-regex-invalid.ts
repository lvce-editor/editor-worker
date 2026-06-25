import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-replace-with-regex-invalid'

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `v22.14.0`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 7]))
  await Editor.openFind()
  await FindWidget.toggleUseRegularExpression()

  // act
  await FindWidget.setValue(`\\`)

  // assert
  const searchFieldError = Locator('.SearchFieldError')
  await expect(searchFieldError).toBeVisible()
}
