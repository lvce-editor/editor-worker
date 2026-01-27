import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.link-detection'

export const skip = 1

export const test: Test = async ({ Editor, expect, Extension, FileSystem, Locator, Main }) => {
  // arrange
  const url = new URL('../fixtures/editor.link-detection', import.meta.url).toString()
  await Extension.addWebExtension(url)
  const tmpDir = await FileSystem.getTmpDir()

  // Create a test file with URLs
  const testContent = `// Some code with links
  https://example.com
  Visit http://github.com for code
  Check https://api.example.com/path
  `

  await FileSystem.writeFile(`${tmpDir}/test-links.txt`, testContent)
  await Main.openUri(`${tmpDir}/test-links.txt`)

  // act
  await Editor.setCursor(1, 2) // Position on the https://example.com line

  // assert - Check that the link has the decorationLink class
  // The test verifies that links are detected and have the appropriate styling class
  const tokens = Locator('.Token')
  // @ts-ignore
  const tokensWithLink = tokens.filter({ has: Locator('.decorationLink') })

  // Verify that at least one token with the decorationLink class is visible
  await expect(tokensWithLink.first()).toBeVisible()
}
