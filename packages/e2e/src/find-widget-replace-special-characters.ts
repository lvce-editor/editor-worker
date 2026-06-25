import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-replace-special-characters'

export const test: Test = async ({ Editor, FileSystem, FindWidget, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `placeholder text
placeholder here
another placeholder`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 11]))
  await Editor.openFind()
  await FindWidget.setValue('placeholder')
  await FindWidget.toggleReplace()

  // act - replace with dollar sign (special in regex replacement)
  await FindWidget.setReplaceValue('$100')
  await FindWidget.replace()

  // assert
  await Editor.shouldHaveText(`$100 text
placeholder here
another placeholder`)

  // act - replace with backslash
  await FindWidget.setReplaceValue('path\\to\\file')
  await FindWidget.replace()

  // assert
  await Editor.shouldHaveText(`$100 text
path\\to\\file here
another placeholder`)

  // act - replace with special regex characters
  await FindWidget.setReplaceValue('.*+?^${}()|[]\\')
  await FindWidget.replace()

  // assert
  await Editor.shouldHaveText(`$100 text
path\\to\\file here
another .*+?^\${}()|[]\\`)
}
