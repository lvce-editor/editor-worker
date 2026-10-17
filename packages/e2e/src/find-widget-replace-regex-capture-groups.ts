import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-replace-regex-capture-groups'

export const test: Test = async ({ Editor, FileSystem, FindWidget, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `hello world
foo bar
test case`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()
  await FindWidget.toggleUseRegularExpression()
  await FindWidget.setValue(`(\\w+) (\\w+)`)
  await FindWidget.toggleReplace()
  await FindWidget.setReplaceValue('$2 $1')

  // act
  await FindWidget.replaceAll()

  // assert
  await Editor.shouldHaveText(`world hello
bar foo
case test`)
}
