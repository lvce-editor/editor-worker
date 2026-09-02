import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.toggle-minimap-quick-pick'

export const test: Test = async ({ expect, FileSystem, Locator, Main, QuickPick, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/file.js`
  const content = Array.from({ length: 100 }, (_, index) => `const value${index} = ${index}`).join('\n')
  await FileSystem.writeFile(uri, content)
  await Settings.update({ 'editor.minimap.enabled': false })
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)

  const minimap = Locator('.EditorMinimap')
  await expect(minimap).toHaveCount(0)

  await QuickPick.open()
  await QuickPick.selectItem('View: Toggle Minimap')

  await expect(minimap).toHaveAttribute('data-line-count', '100')
  await expect(Locator('.EditorMinimapCanvas')).toHaveCount(1)

  await QuickPick.open()
  await QuickPick.selectItem('View: Toggle Minimap')

  await expect(minimap).toHaveCount(0)
  await expect(Locator('.EditorMinimapCanvas')).toHaveCount(0)
}
