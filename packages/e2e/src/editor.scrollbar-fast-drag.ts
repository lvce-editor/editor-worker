import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.scrollbar-fast-drag'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/scrollbar-fast-drag.txt`
  const content = Array.from({ length: 500 }, (_, index) => `line ${String(index).padStart(3, '0')} ${'x'.repeat(80)}`).join('\n')

  await FileSystem.writeFile(filePath, content)
  await Workspace.setPath(tmpDir)
  await Main.closeAllEditors()
  await Main.openUri(filePath)

  const editorRows = Locator('.EditorRows')
  const verticalScrollBar = Locator('.ScrollBarVertical')
  const verticalThumb = Locator('.ScrollBarThumbVertical')

  await expect(editorRows).toBeVisible()
  await Editor.setDeltaY(-100_000)
  await expect(verticalScrollBar).toBeVisible()
  await expect(verticalThumb).toBeVisible()
  await expect(editorRows).toContainText('line')

  await Command.execute('Editor.handleScrollBarVerticalPointerDown', 80)
  await Command.execute('Editor.handleScrollBarVerticalPointerMove', 220)
  await expect(verticalThumb).toBeVisible()
  await expect(editorRows).not.toContainText('line 108')

  await Command.execute('Editor.handleScrollBarVerticalPointerMove', 560)
  await expect(verticalThumb).toBeVisible()
  await expect(editorRows).toContainText('line 3')

  await Command.execute('Editor.handlePointerUp')
}
