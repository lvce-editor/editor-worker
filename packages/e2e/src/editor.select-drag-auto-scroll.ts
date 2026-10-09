import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-select-drag-auto-scroll'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const content = Array.from({ length: 100 }, (_, index) => `line ${index + 1}`).join('\n')
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, content)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Command.execute('Editor.resize', { height: 60, width: 800, x: 0, y: 0 }, 10)
  await Command.execute('Editor.handlePointerDown', 0, false, false, 31, 30, 1, 30)
  await Command.execute('Editor.handleMouseDown', 0, false, false, 31, 30, 1)
  await Editor.shouldHaveSelections(new Uint32Array([1, 0, 1, 0]))
  await Command.execute('Editor.handlePointerMove', 31, 1000, false)

  await new Promise((resolve) => setTimeout(resolve, 500))

  const cursor = Locator('.EditorCursor')
  const line100 = Locator('.EditorRow', { hasText: 'line 100' })
  await expect(cursor).toBeVisible()
  await expect(line100).toBeVisible()
  await Editor.shouldHaveSelections(new Uint32Array([1, 0, 99, 0]))
  await Command.execute('Editor.handlePointerUp')
}
