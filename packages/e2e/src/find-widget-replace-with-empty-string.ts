import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-replace-with-empty-string'

export const test: Test = async ({ Editor, FileSystem, FindWidget, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `hello world
hello there
hello again`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 5]))
  await Editor.openFind()
  await FindWidget.setValue(`hello `)
  await FindWidget.toggleReplace()
  await FindWidget.setReplaceValue('')

  // act
  await FindWidget.replaceAll()

  // assert
  await Editor.shouldHaveText(`world
there
again`)
}
