import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.syntax-highlighting-html-style-inline'

export const test: Test = async ({ expect, Extension, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const extensionUri = import.meta.resolve('../fixtures/editor.syntax-highlighting-html-style-inline')
  await Extension.addWebExtension(extensionUri)
  const tmpDir = await FileSystem.getTmpDir()
  const htmlPath = `${tmpDir}/style-inline.html-with-inline-css-test`
  const htmlContent = `<style>h1 {color:red}</style>

<h1>hello world</h1>`

  await FileSystem.writeFile(htmlPath, htmlContent)
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(htmlPath)

  // assert
  const htmlToken = Locator('.Token.Html', { hasText: '<style>' })
  await expect(htmlToken).toBeVisible()
  const selectorToken = Locator('.Token.CssSelector', { hasText: 'h1' })
  await expect(selectorToken).toBeVisible()
  const propertyToken = Locator('.Token.CssPropertyName', { hasText: 'color' })
  await expect(propertyToken).toBeVisible()
}
