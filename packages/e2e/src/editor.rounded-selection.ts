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
  const first = selections.nth(0)
  const middle = selections.nth(1)
  const last = selections.nth(2)
  await expect(selections).toHaveCount(3)
  await expect(first).toHaveCSS('border-top-left-radius', '0px')
  try {
    await Settings.update({ 'editor.roundedSelection': true })
    await Command.execute('Editor.handleSettingsChanged')
    await expect(first).toHaveCSS('border-top-left-radius', '3px')
    await expect(first).toHaveCSS('border-bottom-left-radius', '0px')
    await expect(middle).toHaveCSS('border-top-left-radius', '0px')
    await expect(middle).toHaveCSS('border-bottom-left-radius', '0px')
    await expect(middle).toHaveCSS('border-top-right-radius', '3px')
    await expect(middle).toHaveCSS('border-bottom-right-radius', '3px')
    await expect(last).toHaveCSS('border-bottom-left-radius', '3px')
    const secondPath = `${tmpDir}/rounded-selection-second.txt`
    await FileSystem.writeFile(secondPath, 'single line')
    await Main.openUri(secondPath)
    await Editor.setSelections(new Uint32Array([0, 0, 0, 6]))
    await expect(selections).toHaveCount(1)
    await expect(first).toHaveCSS('border-top-left-radius', '3px')
    await expect(first).toHaveCSS('border-bottom-right-radius', '3px')
    await Settings.update({ 'editor.roundedSelection': false })
    await Command.execute('Editor.handleSettingsChanged')
    await expect(first).toHaveCSS('border-top-left-radius', '0px')
    await expect(first).toHaveCSS('border-bottom-right-radius', '0px')
  } finally {
    await Settings.update({ 'editor.roundedSelection': false })
    await Command.execute('Editor.handleSettingsChanged')
  }
}
