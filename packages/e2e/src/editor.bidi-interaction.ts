import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.bidi-interaction'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.horizontalVirtualizationThreshold': 5, 'editor.lineNumbers': false, 'editor.rtl': true })
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/bidi.js`, 'abcאבגdef\nمرحبا 123 عالم\n\tאבג\nconst value = "א";\n' + 'x'.repeat(600) + 'אבג')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/bidi.js`)
  await Editor.setCursor(0, 3)
  await Editor.cursorCharacterLeft()
  await Editor.selectCharacterLeft()
  await Editor.shouldHaveSelections(new Uint32Array([0, 4, 0, 5]))
  await Editor.type('ד')
  await Editor.shouldContainText('abcאדגdef')
  await Command.execute('Editor.undo')
  await Editor.shouldContainText('abcאבגdef')
  const firstRow = Locator('.EditorRow').first()
  const bidiRuns = Locator('.EditorBidiRun')
  await expect(firstRow).toHaveText('abcאבגdef')
  await Settings.update({ 'editor.rtl': false })
  await Command.execute('Editor.handleSettingsChanged')
  await expect(bidiRuns).toHaveCount(0)
  await Editor.setCursor(0, 3)
  await Editor.cursorCharacterLeft()
  await Editor.shouldHaveSelections(new Uint32Array([0, 2, 0, 2]))
  await Settings.update({ 'editor.rtl': true })
  await Command.execute('Editor.handleSettingsChanged')
  await Editor.setCursor(0, 3)
  const rtlRun = bidiRuns.nth(1)
  await expect(rtlRun).toHaveCSS('direction', 'rtl')
}
