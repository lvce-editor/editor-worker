import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-large-file'

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange - create a large file with many lines
  const tmpDir = await FileSystem.getTmpDir()
  const lineCount = 10_000
  const lines: string[] = []
  for (let i = 0; i < lineCount; i++) {
    if (i % 100 === 0) {
      lines.push(`needle line ${i}`)
    } else {
      lines.push(`line ${i} with some content`)
    }
  }
  const content = lines.join('\n')
  await FileSystem.writeFile(`${tmpDir}/large-file.txt`, content)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/large-file.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()

  // act
  await FindWidget.setValue('needle')

  // assert - should find all needle occurrences (one every 100 lines)
  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)
  await expect(findWidgetMatchCount).toBeVisible()
  await expect(findWidgetMatchCount).toHaveText('1 of 100')

  // act - navigate through matches
  await FindWidget.focusNext()
  await expect(findWidgetMatchCount).toHaveText('2 of 100')

  // act - search for something with no results
  await FindWidget.setValue('nonexistent-term-xyz')

  // assert
  await expect(findWidgetMatchCount).toHaveText('No Results')
}
