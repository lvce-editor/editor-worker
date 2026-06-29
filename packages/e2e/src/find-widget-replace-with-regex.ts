import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-replace-with-regex'

export const test: Test = async ({ Editor, FileSystem, FindWidget, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `v22.14.0`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 7]))
  await Editor.openFind()
  await FindWidget.setValue(`v.*`)
  await FindWidget.toggleReplace()
  await FindWidget.setReplaceValue('v24')
  await FindWidget.toggleUseRegularExpression()

  // act
  await FindWidget.replace()

  // assert
  await Editor.shouldHaveText(`v24`)
}
