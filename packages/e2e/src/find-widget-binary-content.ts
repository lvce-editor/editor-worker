import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-binary-content'

export const skip = 1

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange - create a file with binary-like content (null bytes, special chars)
  const tmpDir = await FileSystem.getTmpDir()
  // eslint-disable-next-line e18e/prefer-string-fromcharcode
  const controlLine = String.fromCodePoint(0, 1, 2, 3)
  // eslint-disable-next-line e18e/prefer-string-fromcharcode
  const binaryLine = String.fromCodePoint(0xff, 0xfe, 0xfd)
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `normal text
${controlLine}
more normal text
${binaryLine}
end of file`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()

  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)

  // act - search for normal text
  await FindWidget.setValue('normal')

  // assert - should find normal text even with binary content nearby
  await expect(findWidgetMatchCount).toBeVisible()
  await expect(findWidgetMatchCount).toHaveText('1 of 2')

  // act - search for text after binary content
  await FindWidget.setValue('more normal text')

  // assert - should find the text after binary bytes
  await expect(findWidgetMatchCount).toHaveText('1 of 1')

  // act - search for text before binary content
  await FindWidget.setValue('normal text')

  // assert - should find both occurrences
  await expect(findWidgetMatchCount).toHaveText('1 of 2')

  // act - navigate through matches
  await FindWidget.focusNext()

  // assert - should successfully navigate
  await expect(findWidgetMatchCount).toHaveText('2 of 2')

  // act - replace text near binary content
  await FindWidget.toggleReplace()
  await FindWidget.setReplaceValue('replaced text')
  await FindWidget.replace()

  // assert - replace should work correctly
  await expect(findWidgetMatchCount).toHaveText('1 of 1')
}
