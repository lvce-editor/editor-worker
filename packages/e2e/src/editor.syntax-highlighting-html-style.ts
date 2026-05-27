import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.syntax-highlighting-html-style'

export const skip = 1

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const htmlPath = `${tmpDir}/style.html`
  const htmlContent = `<!doctype html>
<html>
  <head>
    <style>
      body { color: red; }
    </style>
  </head>
</html>`

  await FileSystem.writeFile(htmlPath, htmlContent)
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(htmlPath)

  // assert
  const propertyToken = Locator('.Token.CssPropertyName', { hasText: 'color' })
  await expect(propertyToken).toBeVisible()
}
