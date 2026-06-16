import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.syntax-highlighting-nested-extension'
export const test: Test = async ({ expect, Extension, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const extensionUri = import.meta.resolve('../fixtures/editor.syntax-highlighting-nested-extension')
  await Extension.addWebExtension(extensionUri)
  const tmpDir = await FileSystem.getTmpDir()
  const mockPath = `${tmpDir}/nested.mockc`
  const mockContent = `<mock-b>
<mock-a>
alpha`

  await FileSystem.writeFile(mockPath, mockContent)
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(mockPath)

  // assert
  const mockCToken = Locator('.Token.MockCTag', { hasText: '<mock-b>' })
  await expect(mockCToken).toBeVisible()
  const mockBToken = Locator('.Token.MockBTag', { hasText: '<mock-a>' })
  await expect(mockBToken).toBeVisible()
  const mockAToken = Locator('.Token.MockAIdentifier', { hasText: 'alpha' })
  await expect(mockAToken).toBeVisible()
}
