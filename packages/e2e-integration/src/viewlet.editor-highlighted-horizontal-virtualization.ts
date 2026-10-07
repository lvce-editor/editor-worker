import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-highlighted-horizontal-virtualization'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/highlighted-horizontal-virtualization.js`
  const values = Array.from({ length: 1000 }, (_, index) => `"${String(index).padStart(4, '0')}😀"`).join(', ')
  await FileSystem.writeFile(filePath, `const values = [${values}];`)
  await Workspace.setUri(tmpDir)
  await Main.openUri(filePath)

  const editor = Locator('.EditorContent')
  const row = Locator('.EditorRow').first()
  await expect(row).toContainText('const')
  await expect(Locator('.EditorRow .Token.String').first()).toContainText('0000')
  await editor.dispatchEvent('wheel', {
    bubbles: true,
    deltaMode: 0,
    deltaX: 100_000,
    deltaY: 0,
  } as any)
  await expect(row).toContainText('0999😀')
  await expect(Locator('.EditorRow .Token.String', { hasText: '0999😀' })).toHaveCount(1)
  await expect(Locator('.EditorRow', { hasText: '0000' })).toHaveCount(0)

  await editor.dispatchEvent('wheel', {
    bubbles: true,
    deltaMode: 0,
    deltaX: -100_000,
    deltaY: 0,
  } as any)
  await expect(row).toContainText('const')
  await expect(Locator('.EditorRow .Token.String').first()).toContainText('0000')
}
