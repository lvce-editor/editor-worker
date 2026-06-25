import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-replace-all-regex-backreferences'

export const test: Test = async ({ Editor, FileSystem, FindWidget, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `John Smith
Jane Doe
Bob Johnson
Alice Williams`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()
  await FindWidget.toggleUseRegularExpression()
  await FindWidget.setValue(`(\\w+) (\\w+)`)
  await FindWidget.toggleReplace()
  await FindWidget.setReplaceValue('$2, $1')

  // act
  await FindWidget.replaceAll()

  // assert - names should be swapped to "Last, First" format
  await Editor.shouldHaveText(`Smith, John
Doe, Jane
Johnson, Bob
Williams, Alice`)
}
