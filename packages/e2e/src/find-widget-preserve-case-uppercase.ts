import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-preserve-case-uppercase'

export const test: Test = async ({ Editor, FileSystem, FindWidget, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `HELLO world
hello WORLD
HELLO WORLD`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 5]))
  await Editor.openFind()
  await FindWidget.setValue(`hello`)
  await FindWidget.toggleReplace()
  await FindWidget.setReplaceValue('goodbye')
  await FindWidget.togglePreserveCase()

  // act
  await FindWidget.replaceAll()

  // assert - HELLO should become GOODBYE (all uppercase preserved)
  await Editor.shouldHaveText(`GOODBYE world
goodbye WORLD
GOODBYE WORLD`)
}
