import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-incremental-search'

export const skip = 1

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `content contains containers
context control conclude
contain contest continue`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()

  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)

  // act - type 'c'
  await FindWidget.setValue('c')

  // assert - should match many 'c' characters
  await expect(findWidgetMatchCount).toBeVisible()

  // act - type 'co'
  await FindWidget.setValue('co')

  // assert - should narrow down matches
  await expect(findWidgetMatchCount).toHaveText('1 of 9')

  // act - type 'con'
  await FindWidget.setValue('con')

  // assert - should narrow down further
  await expect(findWidgetMatchCount).toHaveText('1 of 9')

  // act - type 'cont'
  await FindWidget.setValue('cont')

  // assert - should have fewer matches
  await expect(findWidgetMatchCount).toHaveText('1 of 6')

  // act - type 'conte'
  await FindWidget.setValue('conte')

  // assert - should narrow down more
  await expect(findWidgetMatchCount).toHaveText('1 of 4')

  // act - type 'conten'
  await FindWidget.setValue('conten')

  // assert - should have even fewer matches
  await expect(findWidgetMatchCount).toHaveText('1 of 2')

  // act - type 'content'
  await FindWidget.setValue('content')

  // assert - should match only 'content'
  await expect(findWidgetMatchCount).toHaveText('1 of 1')

  // act - type something that doesn't exist
  await FindWidget.setValue('contentxyz')

  // assert - should show no results
  await expect(findWidgetMatchCount).toHaveText('No Results')
}
