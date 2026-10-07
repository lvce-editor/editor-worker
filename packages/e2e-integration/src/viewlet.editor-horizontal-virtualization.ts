import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-horizontal-virtualization'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/horizontal-virtualization.txt`
  const line = Array.from({ length: 1000 }, (_, index) => String(index).padStart(4, '0')).join(' ')
  await FileSystem.writeFile(filePath, line)
  await Workspace.setUri(tmpDir)
  await Main.openUri(filePath)

  const editor = Locator('.EditorContent')
  const row = Locator('.EditorRow').first()
  await expect(row).toContainText('0000')
  await expect(Locator('.EditorRow', { hasText: '0999' })).toHaveCount(0)

  await editor.dispatchEvent('wheel', {
    bubbles: true,
    deltaMode: 0,
    deltaX: 400,
    deltaY: 0,
  } as any)
  await expect(Locator('.EditorRow', { hasText: '0000' })).toHaveCount(0)
  await expect(Locator('.EditorRow', { hasText: '0999' })).toHaveCount(0)

  await Editor.setCursor(0, line.length)
  await expect(row).toContainText('0999')
  await Editor.type('!')
  await expect(row).toContainText('0999!')
  await expect(Locator('.EditorRow', { hasText: '0000' })).toHaveCount(0)

  await Editor.setCursor(0, 0)
  await expect(row).toContainText('0000')
  await expect(Locator('.EditorRow', { hasText: '0999!' })).toHaveCount(0)
}
