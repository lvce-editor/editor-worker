import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.cached-highlighting-lifecycle'

export const test: Test = async ({ Command, Editor, expect, Extension, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.syntaxHighlightingCache': true })
  try {
    await Extension.addWebExtension(import.meta.resolve('../fixtures/editor.persisted-tokens'))
    const tmpDir = await FileSystem.getTmpDir()
    const uri = `${tmpDir}/lifecycle.cachetest`
    const lines = ['/*', ...Array.from({ length: 250 }, (_, i) => `comment line ${i}`), '*/', '@embedded']
    await FileSystem.writeFile(uri, lines.join('\n'))
    await Workspace.setPath(tmpDir)
    await Main.openUri(uri)
    const firstComment = Locator('.Token.CacheComment', { hasText: 'comment line 0' })
    await expect(firstComment).toBeVisible()
    await Main.closeAllEditors()
    await Main.openUri(uri)
    await expect(firstComment).toBeVisible()
    // A viewport beyond the persisted opening range must reconstruct multiline state.
    await Editor.setCursor(241, 0)
    const distantComment = Locator('.Token.CacheComment', { hasText: 'comment line 240' })
    await expect(distantComment).toBeVisible()
    await Editor.setCursor(0, 0)
    await Editor.setSelections(new Uint32Array([0, 0, 0, 2]))
    await Editor.type('//')
    await Editor.setCursor(241, 0)
    const distantCode = Locator('.Token.CacheCode', { hasText: 'comment line 240' })
    await expect(distantCode).toBeVisible()
    await Editor.setCursor(252, 0)
    const embedded = Locator('.Token.CacheEmbedded', { hasText: '@embedded' })
    await expect(embedded).toBeVisible()
    await Command.execute('Editor.setLanguageId', 'plaintext', '')
    const embeddedTokens = Locator('.Token.CacheEmbedded')
    await expect(embeddedTokens).toHaveCount(0)
  } finally {
    await Main.closeAllEditors()
    await Settings.update({ 'editor.syntaxHighlightingCache': false })
  }
}
