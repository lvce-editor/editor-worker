import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.persisted-tokens'

export const test: Test = async ({ expect, Extension, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.syntaxHighlightingCache': true })
  try {
    await Extension.addWebExtension(import.meta.resolve('../fixtures/editor.persisted-tokens'))
    const tmpDir = await FileSystem.getTmpDir()
    const uri = `${tmpDir}/tokens.cachetest`
    await FileSystem.writeFile(uri, '/*\ninside comment\n*/\ncode\n@embedded')
    await Workspace.setPath(tmpDir)
    await Main.openUri(uri)
    const comment = Locator('.Token.CacheComment', { hasText: 'inside comment' })
    await expect(comment).toBeVisible()
    const code = Locator('.Token.CacheCode', { hasText: 'code' })
    await expect(code).toBeVisible()
    const embedded = Locator('.Token.CacheEmbedded', { hasText: '@embedded' })
    await expect(embedded).toBeVisible()
  } finally {
    await Main.closeAllEditors()
    await Settings.update({ 'editor.syntaxHighlightingCache': false })
  }
}
