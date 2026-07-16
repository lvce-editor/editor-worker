import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.syntax-highlighting-extension-main-missing'

export const test: Test = async ({ expect, Extension, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const extensionUri = import.meta.resolve('../fixtures/editor.syntax-highlighting-edge-cases')
  await Extension.addWebExtension(extensionUri)
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/main.shmainmissing`
  await FileSystem.writeFile(filePath, 'keyword value')
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(filePath)

  // assert
  const keywordToken = Locator('.Token.EdgeKeyword', { hasText: 'keyword' })
  await expect(keywordToken).toBeVisible()
}
