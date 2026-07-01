import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.syntax-highlighting-tokenizer-invalid-result'

export const test: Test = async ({ expect, Extension, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const extensionUri = import.meta.resolve('../fixtures/editor.syntax-highlighting-edge-cases')
  await Extension.addWebExtension(extensionUri)
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const cases = [
    {
      fileName: 'null.shinvalidresultnull',
      text: 'null result',
    },
    {
      fileName: 'no-tokens.shinvalidresultnotokens',
      text: 'missing tokens',
    },
    {
      fileName: 'no-state.shinvalidresultnostate',
      text: 'missing state',
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
