import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-select-up'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const content = Array.from({ length: 100 }, (_, index) => `line ${index + 1}`).join('\n')
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, content)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(50, 0)

  for (let i = 0; i < 30; i++) {
    await Editor.selectUp()
  }

  await Editor.shouldHaveSelections(new Uint32Array([50, 0, 20, 0]))
  const cursor = Locator('.EditorCursor')
  const line21 = Locator('.EditorRow', { hasText: 'line 21' })
  await expect(cursor).toBeVisible()
  await expect(line21).toBeVisible()
}
