import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.syntax-highlighting-nested-runtime-error'

export const test: Test = async ({ expect, Extension, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const extensionUri = import.meta.resolve('../fixtures/editor.syntax-highlighting-edge-cases')
  await Extension.addWebExtension(extensionUri)
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/runtime.shnestedruntime`
  await FileSystem.writeFile(filePath, `<runtime>
throw`)
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(filePath)

  // assert
  const outerToken = Locator('.Token.EdgeNestedRuntimeOuter', { hasText: '<runtime>' })
  await expect(outerToken).toBeVisible()
  const fallbackToken = Locator('.Token.Unknown', { hasText: 'throw' })
  await expect(fallbackToken).toBeVisible()
}
