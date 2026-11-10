import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.syntax-highlighting-tokenizer-runtime-error'

export const test: Test = async ({ expect, Extension, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const extensionUri = import.meta.resolve('../fixtures/editor.syntax-highlighting-edge-cases')
  await Extension.addWebExtension(extensionUri)
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/runtime.shruntimeerror`
  await FileSystem.writeFile(filePath, `throw
fine`)
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(filePath)

  // assert
  const fallbackToken = Locator('.Token.Unknown', { hasText: 'throw' })
  await expect(fallbackToken).toBeVisible()
  const recoveredToken = Locator('.Token.EdgeRuntimeOk', { hasText: 'fine' })
  await expect(recoveredToken).toBeVisible()
}
