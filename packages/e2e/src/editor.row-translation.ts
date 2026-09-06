import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.row-translation'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/row-translation.txt`
  const content = 'x'.repeat(500)
  await FileSystem.writeFile(filePath, content)
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)

  const row = Locator('.EditorRow').first()
  await expect(row).toHaveCSS('translate', 'none')

  const editor = Locator('.EditorContent')
  await editor.dispatchEvent('wheel', {
    bubbles: true,
    deltaMode: 0,
    deltaX: 1,
    deltaY: 0,
  } as any)
  await expect(row).toHaveCSS('translate', '-1px')

  await editor.dispatchEvent('wheel', {
    bubbles: true,
    deltaMode: 0,
    deltaX: -1,
    deltaY: 0,
  } as any)
  await expect(row).toHaveCSS('translate', 'none')
}
