import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.large-file-mode'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Settings }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/large-mode.json`
  await FileSystem.writeFile(uri, '{"name":"demo"}')
  const propertyToken = Locator('.Token.JsonPropertyName', { hasText: 'name' })
  const propertyTokens = Locator('.Token.JsonPropertyName')
  const plainText = Locator('.Token.Text', { hasText: '{"name":"demo"}' })
  const largeFileText = Locator('.Token.Text')
  const minimap = Locator('.EditorMinimap')
  const normalProperty = Locator('.Token.JsonPropertyName', { hasText: 'normal' })
  await Main.openUri(uri)
  await expect(propertyToken).toBeVisible()

  await Command.execute('Editor.loadContent', { largeFile: true })
  await expect(propertyTokens).toHaveCount(0)
  await expect(plainText).toBeVisible()

  const diagnostics = await Command.execute('Preferences.get', 'editor.diagnostics')
  const minimapEnabled = await Command.execute('Preferences.get', 'editor.minimap.enabled')
  try {
    await Settings.update({ 'editor.diagnostics': true, 'editor.minimap.enabled': true })
    await expect(minimap).toHaveCount(0)
    await expect(propertyTokens).toHaveCount(0)

    const normalUri = `${tmpDir}/normal.json`
    await FileSystem.writeFile(normalUri, '{"normal":true}')
    await Main.openUri(normalUri)
    await expect(normalProperty).toBeVisible()

    const heapSnapshotUri = `${tmpDir}/heap-snapshot.json`
    await FileSystem.writeFile(heapSnapshotUri, `{"snapshot":"${'x'.repeat(10 * 1024 * 1024 + 1)}"}`)
    await Main.openUri(heapSnapshotUri)
    await expect(propertyTokens).toHaveCount(0)
    await expect(largeFileText).toBeVisible()
  } finally {
    await Settings.update({ 'editor.diagnostics': diagnostics, 'editor.minimap.enabled': minimapEnabled })
  }
}
