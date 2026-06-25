import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-narrow-width'

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `content 1
content 2
content 3`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 7]))
  await Editor.openFind()

  // assert - find widget should be visible even with narrow width
  const findWidgetInput = Locator('.FindWidget .MultilineInputBox')
  await expect(findWidgetInput).toBeVisible()
  await expect(findWidgetInput).toHaveValue('content')

  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)
  await expect(findWidgetMatchCount).toBeVisible()
  await expect(findWidgetMatchCount).toHaveText('1 of 3')

  // act - test basic functionality still works
  await FindWidget.focusNext()

  // assert - navigation should still work
  await expect(findWidgetMatchCount).toHaveText('2 of 3')

  // act - test replace functionality
  await FindWidget.toggleReplace()

  // assert - replace section should be visible
  const replace = Locator(`.FindWidget .FindWidgetReplace`)
  await expect(replace).toBeVisible()

  // act - set replace value and perform replace
  await FindWidget.setReplaceValue('replaced')
  await FindWidget.replace()

  // assert - replace should work correctly
  await expect(findWidgetMatchCount).toHaveText('2 of 2')
  await Editor.shouldHaveText(`content 1
replaced 2
content 3`)
}
