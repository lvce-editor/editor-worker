import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-reveal-from-tab-context-menu'

export const skip = 1

export const test: Test = async ({ Command, ContextMenu, expect, Explorer, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const firstFile = `${tmpDir}/a.txt`
  const secondFile = `${tmpDir}/b.txt`
  await FileSystem.writeFile(firstFile, 'content 1')
  await FileSystem.writeFile(secondFile, 'content 2')
  await Workspace.setPath(tmpDir)

  const firstTreeItem = Locator('.TreeItem[aria-label="a.txt"]')
  const secondTreeItem = Locator('.TreeItem[aria-label="b.txt"]')
  await expect(firstTreeItem).toBeVisible()
  await expect(secondTreeItem).toBeVisible()

  await Explorer.focusIndex(0)
  await expect(firstTreeItem).toHaveId('TreeItemActive')

  await Main.openUri(secondFile)
  const tab = Locator('.MainTab[title$="b.txt"]')
  await expect(tab).toBeVisible()

  // act
  await Command.execute('Main.handleTabContextMenu', 0, 0, 0)
  const closeMenuItem = Locator('text=Close').first()
  await expect(closeMenuItem).toBeVisible()
  await ContextMenu.selectItem('Reveal in Explorer')

  // assert
  await expect(secondTreeItem).toHaveId('TreeItemActive')
}
