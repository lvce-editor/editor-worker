import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-vertical-scrolling'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const content = Array.from({ length: 100 }, (_, index) => `line ${index + 1}`).join('\n')
  await FileSystem.writeFile(`${tmpDir}/file.txt`, content)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file.txt`)

  const editor = Locator('.EditorContent')
  await editor.dispatchEvent('wheel', {
    bubbles: true,
    deltaMode: 0,
    deltaX: 0,
    deltaY: 600,
  } as any)

  const line31 = Locator('.EditorRow', { hasText: 'line 31' })
  await expect(line31).toBeVisible()

  await Editor.setCursor(0, 0)
  await Command.execute('Editor.cursorPageDown')
  await Editor.shouldHaveSelections(new Uint32Array([32, 0, 32, 0]))

  await Editor.setCursor(0, 0)
  for (let i = 0; i < 26; i++) {
    await Editor.cursorDown()
  }

  await Editor.shouldHaveSelections(new Uint32Array([26, 0, 26, 0]))
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toBeVisible()
}
