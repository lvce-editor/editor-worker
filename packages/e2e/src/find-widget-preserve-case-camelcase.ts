import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-preserve-case-camelcase'

export const test: Test = async ({ Editor, FileSystem, FindWidget, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `helloWorld
HelloWorld
helloworld
HELLOWORLD`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 10]))
  await Editor.openFind()
  await FindWidget.setValue(`helloworld`)
  await FindWidget.toggleReplace()
  await FindWidget.setReplaceValue('goodbye')
  await FindWidget.togglePreserveCase()

  // act
  await FindWidget.replaceAll()

  // assert - camelCase should be preserved where applicable
  await Editor.shouldHaveText(`goodbye
Goodbye
goodbye
GOODBYE`)
}
