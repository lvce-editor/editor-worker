import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.combine-whitespace-tokens'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.combineWhitespaceTokens': true })
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/combine-whitespace.js`
  await FileSystem.writeFile(filePath, 'const answer = 42')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)

  const row = Locator('.EditorRow')
  const keyword = Locator('.EditorRow .Token.Keyword')
  const whitespace = Locator('.EditorRow .Token.Whitespace')
  await expect(keyword).toHaveText('const ')
  await expect(whitespace).toHaveCount(0)

  await Settings.update({ 'editor.combineWhitespaceTokens': false })
  await Command.execute('Editor.handleSettingsChanged')
  await expect(keyword).toHaveText('const')
  await expect(whitespace).toHaveCount(3)

  await Settings.update({ 'editor.combineWhitespaceTokens': true })
  await Command.execute('Editor.handleSettingsChanged')
  await expect(keyword).toHaveText('const ')
  await expect(whitespace).toHaveCount(0)
  await expect(row).toHaveText('const answer = 42')
}
