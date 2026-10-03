import type { Test } from '@lvce-editor/test-with-playwright'

const expectResponsive = async (operation: Promise<void>): Promise<void> => {
  let timeout: ReturnType<typeof setTimeout> | undefined
  try {
    await Promise.race([
      operation,
      new Promise<never>((_resolve, reject) => {
        timeout = setTimeout(() => reject(new Error('UI operation was blocked by the pending hover provider')), 2000)
      }),
    ])
  } finally {
    clearTimeout(timeout)
  }
}

export const name = 'editor.hover-pending-explorer'

export const test: Test = async ({
  Command,
  Editor,
  expect,
  Explorer,
  Extension,
  FileSystem,
  Locator,
  Main,
  Settings,
  TitleBarMenuBar,
  Workspace,
}) => {
  await Settings.update({ 'editor.diagnostics': false, 'editor.hover': true })
  await Extension.addWebExtension(import.meta.resolve('../fixtures/editor.hover-pending'))
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  for (let cycle = 0; cycle < 3; cycle++) {
    const uri = `${tmpDir}/target-${Date.now()}-${cycle}.pending-hover`
    const otherUri = `${tmpDir}/other-${cycle}.txt`
    await FileSystem.writeFile(uri, 'hover target')
    await FileSystem.writeFile(otherUri, 'other file')
    await Main.closeAllEditors()
    await Main.openUri(uri)
    await Editor.setCursor(0, 0)
    const pending = Command.execute('Editor.showHover', { columnIndex: 0, rowIndex: 0 })
    await Command.executeExtensionCommand('pendingHover.wait')
    try {
      await expectResponsive(TitleBarMenuBar.toggleIndex(0))
      const menu = Locator('[role=menu]')
      await expect(menu).toBeVisible()
      await TitleBarMenuBar.closeMenu()
      await expectResponsive(Explorer.reveal(otherUri))
      await expectResponsive(Explorer.clickCurrent())
      await Editor.shouldHaveText('other file')
    } finally {
      await Command.executeExtensionCommand('pendingHover.resolve')
      await pending
    }
    const hover = Locator('.EditorHover')
    await expect(hover).toBeHidden()
  }
}
