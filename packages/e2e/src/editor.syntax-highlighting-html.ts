import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.syntax-highlighting-html'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const htmlPath = `${tmpDir}/index.html`
  const htmlContent = `<!doctype html>
<html>
  <body data-kind="demo">Hello</body>
</html>`

  await FileSystem.writeFile(htmlPath, htmlContent)
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(htmlPath)

  // assert
  const attributeToken = Locator('.Token.AttributeName', { hasText: 'data-kind' })
  await expect(attributeToken).toBeVisible()
}
