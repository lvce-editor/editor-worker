import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-buttons-disabled'

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

  // act - search for something that doesn't exist
  await FindWidget.setValue('nonexistent')

  // assert - navigation buttons should be disabled when no results
  const buttonPreviousMatch = Locator('[title="Previous Match"]')
  await expect(buttonPreviousMatch).toHaveAttribute('disabled', '')
  const buttonNextMatch = Locator('[title="Next Match"]')
  await expect(buttonNextMatch).toHaveAttribute('disabled', '')

  // act - search for something that exists
  await FindWidget.setValue('content')

  // assert - navigation buttons should be enabled when there are results
  await expect(buttonPreviousMatch).not.toHaveAttribute('disabled', '')
  await expect(buttonNextMatch).not.toHaveAttribute('disabled', '')

  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)
  await expect(findWidgetMatchCount).toHaveText('1 of 2')

  // act - expand replace and check replace buttons when no results
  await FindWidget.toggleReplace()
  await FindWidget.setValue('nonexistent')

  // assert - replace buttons should be disabled when no results
  const buttonReplace = Locator('[title="Replace"]')
  await expect(buttonReplace).toHaveAttribute('disabled', '')
  const buttonReplaceAll = Locator('[title="Replace All"]')
  await expect(buttonReplaceAll).toHaveAttribute('disabled', '')

  // act - search for something that exists
  await FindWidget.setValue('content')

  // assert - replace buttons should be enabled when there are results
  await expect(buttonReplace).not.toHaveAttribute('disabled', '')
  await expect(buttonReplaceAll).not.toHaveAttribute('disabled', '')
}
