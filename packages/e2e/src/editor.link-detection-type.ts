import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.link-detection-type'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()

  // Create a test file with no links initially
  const testContent = ``

  await FileSystem.writeFile(`${tmpDir}/test-links-type.txt`, testContent)
  await Main.openUri(`${tmpDir}/test-links-type.txt`)

  // act - Type a URL
  await Editor.type('https://example.com')

  // assert - Check that the link has the Link class
  const tokensWithLink = Locator('.Token.Link')

  await expect(tokensWithLink).toBeVisible()
}
