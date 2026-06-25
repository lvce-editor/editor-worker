import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-replace-sequential'

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `apple banana apple
cherry apple grape
apple orange apple`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 5]))
  await Editor.openFind()
  await FindWidget.setValue('apple')
  await FindWidget.toggleReplace()
  await FindWidget.setReplaceValue('FRUIT')

  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)
  await expect(findWidgetMatchCount).toHaveText('1 of 5')

  // act - replace first occurrence
  await FindWidget.replace()

  // assert - first apple replaced, moved to next match
  await expect(findWidgetMatchCount).toHaveText('1 of 4')
  await Editor.shouldHaveText(`FRUIT banana apple
cherry apple grape
apple orange apple`)

  // act - replace second occurrence
  await FindWidget.replace()

  // assert - second apple replaced
  await expect(findWidgetMatchCount).toHaveText('1 of 3')
  await Editor.shouldHaveText(`FRUIT banana FRUIT
cherry apple grape
apple orange apple`)

  // act - replace third occurrence
  await FindWidget.replace()

  // assert - third apple replaced
  await expect(findWidgetMatchCount).toHaveText('1 of 2')
  await Editor.shouldHaveText(`FRUIT banana FRUIT
cherry FRUIT grape
apple orange apple`)

  // act - replace fourth occurrence
  await FindWidget.replace()

  // assert - fourth apple replaced
  await expect(findWidgetMatchCount).toHaveText('1 of 1')
  await Editor.shouldHaveText(`FRUIT banana FRUIT
cherry FRUIT grape
FRUIT orange apple`)

  // act - replace last occurrence
  await FindWidget.replace()

  // assert - all apples replaced
  await expect(findWidgetMatchCount).toHaveText('No Results')
  await Editor.shouldHaveText(`FRUIT banana FRUIT
cherry FRUIT grape
FRUIT orange FRUIT`)
}
