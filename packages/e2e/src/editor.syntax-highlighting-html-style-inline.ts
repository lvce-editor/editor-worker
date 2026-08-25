import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.syntax-highlighting-html-style-inline'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const htmlPath = `${tmpDir}/style-inline.html`
  const htmlContent = `<style>h1 {color:red}</style>

<h1>hello world</h1>`

  await FileSystem.writeFile(htmlPath, htmlContent)
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(htmlPath)

  // assert
  const selectorToken = Locator('.Token.CssSelector', { hasText: 'h1' })
  await expect(selectorToken).toBeVisible()
  const propertyToken = Locator('.Token.CssPropertyName', { hasText: 'color' })
  await expect(propertyToken).toBeVisible()
}
