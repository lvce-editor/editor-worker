import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.syntax-highlighting-tokenizer-invalid-token-map'

export const test: Test = async ({ expect, Extension, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const extensionUri = import.meta.resolve('../fixtures/editor.syntax-highlighting-edge-cases')
  await Extension.addWebExtension(extensionUri)
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const cases = [
    {
      fileName: 'array.shinvalidtokenmaparray',
      text: 'array token map',
    },
    {
      fileName: 'null.shinvalidtokenmapnull',
      text: 'null token map',
    },
    {
      fileName: 'string.shinvalidtokenmapstring',
      text: 'string token map',
    },
  ]

  for (const testCase of cases) {
    const filePath = `${tmpDir}/${testCase.fileName}`
    await FileSystem.writeFile(filePath, testCase.text)

    // act
    await Main.openUri(filePath)

    // assert
    const fallbackToken = Locator('.Token.Unknown', { hasText: testCase.text })
    await expect(fallbackToken).toBeVisible()
  }
}
