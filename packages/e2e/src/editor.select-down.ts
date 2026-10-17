import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-select-down'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const content = Array.from({ length: 100 }, (_, index) => `line ${index + 1}`).join('\n')
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, content)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 0)

  for (let i = 0; i < 26; i++) {
    await Editor.selectDown()
  }

  await Editor.shouldHaveSelections(new Uint32Array([0, 0, 26, 0]))
  const cursor = Locator('.EditorCursor')
  const line27 = Locator('.EditorRow', { hasText: 'line 27' })
  await expect(cursor).toBeVisible()
  await expect(line27).toBeVisible()
}
