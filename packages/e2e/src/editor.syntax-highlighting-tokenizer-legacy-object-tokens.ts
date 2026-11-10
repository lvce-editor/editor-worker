import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.syntax-highlighting-tokenizer-legacy-object-tokens'

export const test: Test = async ({ expect, Extension, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const extensionUri = import.meta.resolve('../fixtures/editor.syntax-highlighting-edge-cases')
  await Extension.addWebExtension(extensionUri)
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/legacy.shlegacyobjecttokens`
  await FileSystem.writeFile(filePath, 'legacydata')
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(filePath)

  // assert
  const keywordToken = Locator('.Token.EdgeLegacyKeyword', { hasText: 'legacy' })
  await expect(keywordToken).toBeVisible()
  const textToken = Locator('.Token.EdgeLegacyText', { hasText: 'data' })
  await expect(textToken).toBeVisible()
}
