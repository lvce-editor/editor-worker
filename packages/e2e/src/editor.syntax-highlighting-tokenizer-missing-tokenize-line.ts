import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.syntax-highlighting-tokenizer-missing-tokenize-line'

export const test: Test = async ({ expect, Extension, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const extensionUri = import.meta.resolve('../fixtures/editor.syntax-highlighting-edge-cases')
  await Extension.addWebExtension(extensionUri)
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/missing.shmissingtokenizeline`
  await FileSystem.writeFile(filePath, 'missing tokenize line')
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(filePath)

  // assert
  const fallbackToken = Locator('.Token.Unknown', { hasText: 'missing tokenize line' })
  await expect(fallbackToken).toBeVisible()
}
