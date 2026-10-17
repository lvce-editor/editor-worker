import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.merge-conflict-gutter-line-numbers'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.lineNumbers': true, 'editor.mergeConflictActions': true })
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/merge-conflict-gutter-line-numbers.txt`
  await FileSystem.writeFile(uri, 'before\n<<<<<<< HEAD\ncurrent\n=======\nincoming\n>>>>>>> branch\nafter')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  const lineNumbers = Locator('.LineNumber')
  const firstLineNumber = lineNumbers.nth(0)
  const actionsGutter = lineNumbers.nth(1)
  const markerLineNumber = lineNumbers.nth(2)
  const lastLineNumber = lineNumbers.nth(7)

  await expect(lineNumbers).toHaveCount(8)
  await expect(firstLineNumber).toHaveText('1')
  await expect(actionsGutter).toHaveText('')
  await expect(markerLineNumber).toHaveText('2')
  await expect(lastLineNumber).toHaveText('7')
  await expect(actionsGutter).toHaveAttribute('class', 'LineNumber MergeConflictActionsGutter')
}
