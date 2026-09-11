import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.rounded-selection'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/rounded-selection.txt`
  await FileSystem.writeFile(filePath, 'short\na much longer middle line\nshort')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Editor.setSelections(new Uint32Array([0, 0, 2, 5]))
  const selections = Locator('.EditorSelection')
  await expect(selections).toHaveCount(3)
  await expect(selections.nth(0)).toHaveCSS('border-top-left-radius', '0px')
  try {
    await Settings.update({ 'editor.roundedSelection': true })
    await Command.execute('Editor.handleSettingsChanged')
    await expect(selections.nth(0)).toHaveCSS('border-top-left-radius', '3px')
    await expect(selections.nth(0)).toHaveCSS('border-bottom-left-radius', '0px')
    await expect(selections.nth(1)).toHaveCSS('border-top-left-radius', '0px')
    await expect(selections.nth(1)).toHaveCSS('border-bottom-left-radius', '0px')
    await expect(selections.nth(1)).toHaveCSS('border-top-right-radius', '3px')
    await expect(selections.nth(1)).toHaveCSS('border-bottom-right-radius', '3px')
    await expect(selections.nth(2)).toHaveCSS('border-bottom-left-radius', '3px')
    await Settings.update({ 'editor.roundedSelection': false })
    await Command.execute('Editor.handleSettingsChanged')
    await expect(selections.nth(0)).toHaveCSS('border-top-left-radius', '0px')
    await expect(selections.nth(1)).toHaveCSS('border-bottom-right-radius', '0px')
  } finally {
    await Settings.update({ 'editor.roundedSelection': false })
    await Command.execute('Editor.handleSettingsChanged')
  }
}
