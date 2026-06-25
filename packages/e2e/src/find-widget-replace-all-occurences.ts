import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.find-replace-all-occurrences'

export const test: Test = async ({ Editor, FileSystem, FindWidget, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `content 1
content 2`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 7]))
  await Editor.openFind()
  await FindWidget.setValue(`content`)
  await FindWidget.toggleReplace()
  await FindWidget.setReplaceValue('replaced')

  // act
  await FindWidget.replaceAll()

  // assert
  await Editor.shouldHaveText(`replaced 1
replaced 2`)
}
