import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.syntax-highlighting-tokenizer-top-level-error'

export const test: Test = async ({ expect, Extension, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const extensionUri = import.meta.resolve('../fixtures/editor.syntax-highlighting-edge-cases')
  await Extension.addWebExtension(extensionUri)
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/broken.shtoplevelerror`
  await FileSystem.writeFile(filePath, 'top level error')
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(filePath)

  // assert
  const fallbackToken = Locator('.Token.Unknown', { hasText: 'top level error' })
  await expect(fallbackToken).toBeVisible()
}
