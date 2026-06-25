import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.find-replace-all-updates-match-count'

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `foo bar foo
foo baz foo`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 3]))
  await Editor.openFind()
  await FindWidget.setValue(`foo`)
  await FindWidget.toggleReplace()
  await FindWidget.setReplaceValue('replaced')

  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)
  await expect(findWidgetMatchCount).toBeVisible()
  await expect(findWidgetMatchCount).toHaveText('1 of 4')

  // act
  await FindWidget.replaceAll()

  // assert
  await expect(findWidgetMatchCount).toHaveText('No Results')
  await Editor.shouldHaveText(`replaced bar replaced
replaced baz replaced`)
}
