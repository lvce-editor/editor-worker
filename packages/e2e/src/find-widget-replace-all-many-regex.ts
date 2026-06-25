import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-replace-all-many-regex'

export const test: Test = async ({ Editor, FileSystem, FindWidget, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const lineCount = 20_000
  const lines: string[] = []
  for (let i = 0; i < lineCount; i++) {
    lines.push(`item-${i}`)
  }
  const content = lines.join('\n')
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, content)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()
  await FindWidget.toggleUseRegularExpression()
  await FindWidget.setValue(`item-(\\d+)`)
  await FindWidget.toggleReplace()
  await FindWidget.setReplaceValue('replaced-$1')

  // act
  await FindWidget.replaceAll()

  // assert
  const expectedLines: string[] = []
  for (let i = 0; i < lineCount; i++) {
    expectedLines.push(`replaced-${i}`)
  }
  const expectedContent = expectedLines.join('\n')
  await Editor.shouldHaveText(expectedContent)
}
