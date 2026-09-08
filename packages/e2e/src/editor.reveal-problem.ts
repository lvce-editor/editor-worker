import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.reveal-problem'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Panel }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/problem.txt`
  const lines = Array.from({ length: 100 }, (_, index) => `line ${index + 1}`)
  await FileSystem.writeFile(uri, lines.join('\n'))
  await Main.openUri(uri)
  await Panel.openProblems()
  const filter = Locator('input[placeholder="Filter"]')
  await filter.type('')
  await expect(filter).toBeFocused()
  await Command.execute('Editor.revealProblem', 80, 2)
  await expect(filter).toBeFocused()
  const highlighted = Locator('.EditorProblemsHighlightedRow')
  await expect(highlighted).toHaveCount(1)
  await expect(highlighted).toHaveText('line 81')
  await expect(highlighted).toBeVisible()
  await Editor.shouldHaveSelections(new Uint32Array([80, 2, 80, 2]))
  await Command.execute('Editor.revealProblem', 79, 0)
  await expect(highlighted).toHaveCount(1)
  await expect(highlighted).toHaveText('line 80')
  await Command.execute('Main.focus')
  await expect(highlighted).toHaveCount(0)
}
