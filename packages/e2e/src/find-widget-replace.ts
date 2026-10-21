import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-replace'

export const test: Test = async ({ Command, Editor, FileSystem, FindWidget, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `a`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  // Start a fresh find session; opening a file can restore its find widget.
  await Command.execute('Editor.closeFind')
  await Editor.setSelections(new Uint32Array([0, 0, 0, 7]))
  await Editor.openFind()
  await FindWidget.toggleReplace()
  await FindWidget.setReplaceValue('b')

  // act
  await FindWidget.replace()

  // assert
  await Editor.shouldHaveText('b')
}
