import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-open-with-multiline-selection'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `line 1
line 2
line 3
line 1
line 2
line 3`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)

  // act - select text spanning multiple lines (line 1 through line 2)
  await Editor.setSelections(new Uint32Array([0, 0, 1, 6]))
  await Editor.openFind()

  // assert - find widget should contain the multi-line selection
  const findWidgetInput = Locator('.FindWidget .MultilineInputBox')
  await expect(findWidgetInput).toBeVisible()
  await expect(findWidgetInput).toHaveValue(`line 1
line 2`)

  // assert - should find matches for the multi-line search
  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)
  await expect(findWidgetMatchCount).toBeVisible()
  await expect(findWidgetMatchCount).toHaveText('1 of 2')
}
