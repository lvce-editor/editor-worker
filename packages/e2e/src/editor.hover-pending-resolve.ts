import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.hover-pending-resolve'

export const test: Test = async ({ Command, Editor, expect, Extension, FileSystem, KeyBoard, Locator, Main, Settings }) => {
  await Settings.update({ 'editor.diagnostics': false, 'editor.hover': true })
  await Extension.addWebExtension(import.meta.resolve('../fixtures/editor.hover-pending'))
  const tmpDir = await FileSystem.getTmpDir()
  for (let cycle = 0; cycle < 3; cycle++) {
    const uri = `${tmpDir}/resolve-${Date.now()}-${cycle}.pending-hover`
    await FileSystem.writeFile(uri, 'hover target')
    await Main.closeAllEditors()
    await Main.openUri(uri)
    await Editor.setCursor(0, 0)
    const pending = Command.execute('Editor.showHover2', { columnIndex: 0, rowIndex: 0 })
    await Command.executeExtensionCommand('pendingHover.wait')
    await Command.executeExtensionCommand('pendingHover.resolve')
    await pending
    const hover = Locator('.EditorHover')
    await expect(hover).toContainText('resolved hover')
    await KeyBoard.press('Escape')
    await expect(hover).toBeHidden()
    await Editor.type('x')
    await Editor.shouldHaveText('xhover target')
  }
}
