import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.syntax-highlighting-nested-partial-line'

// TODO enable when partial-line embedded tokenization is rendered, not only full-line embedded tokenization.
export const skip = 1

export const test: Test = async ({ expect, Extension, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const extensionUri = import.meta.resolve('../fixtures/editor.syntax-highlighting-edge-cases')
  await Extension.addWebExtension(extensionUri)
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/partial.shnestedpartial`
  await FileSystem.writeFile(filePath, 'pre [inner] post')
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(filePath)

  // assert
  const innerToken = Locator('.Token.EdgeNestedInner', { hasText: 'inner' })
  await expect(innerToken).toBeVisible()
}
