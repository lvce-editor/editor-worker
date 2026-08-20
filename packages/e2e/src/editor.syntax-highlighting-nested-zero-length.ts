import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.syntax-highlighting-nested-zero-length'

export const test: Test = async ({ expect, Extension, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const extensionUri = import.meta.resolve('../fixtures/editor.syntax-highlighting-edge-cases')
  await Extension.addWebExtension(extensionUri)
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/zero.shnestedzero`
  await FileSystem.writeFile(filePath, 'zero nested')
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(filePath)

  // assert
  const outerToken = Locator('.Token.EdgeNestedZeroOuter', { hasText: 'zero nested' })
  await expect(outerToken).toBeVisible()
}
