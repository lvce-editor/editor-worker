import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.syntax-highlighting-nested-missing-language'

export const test: Test = async ({ expect, Extension, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const extensionUri = import.meta.resolve('../fixtures/editor.syntax-highlighting-edge-cases')
  await Extension.addWebExtension(extensionUri)
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/missing.shnestedmissing`
  await FileSystem.writeFile(filePath, 'missing nested')
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(filePath)

  // assert
  const outerToken = Locator('.Token.EdgeNestedOuter', { hasText: 'missing nested' })
  await expect(outerToken).toBeVisible()
  const nestedToken = Locator('.Token.EdgeNestedInner')
  await expect(nestedToken).toHaveCount(0)
}
