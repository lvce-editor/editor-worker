import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-select-drag-up-auto-scroll'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const content = Array.from({ length: 100 }, (_, index) => `line ${index + 1}`).join('\n')
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, content)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Command.execute('Editor.resize', { height: 60, width: 800, x: 0, y: 0 }, 10)
  await Editor.setDeltaY(300)
  await Command.execute('Editor.handlePointerDown', 0, false, false, 31, 30, 1, 30)
  await Command.execute('Editor.handleMouseDown', 0, false, false, 31, 30, 1)
  await Command.execute('Editor.handlePointerMove', 31, -100, false)

  const line1 = Locator('.EditorRow').first()
  const cursor = Locator('.EditorCursor')
  await expect(line1).toHaveText('line 1')
  await Editor.shouldHaveSelections(new Uint32Array([16, 0, 0, 0]))
  await expect(cursor).toBeVisible()
  await Command.execute('Editor.handlePointerUp')
}
