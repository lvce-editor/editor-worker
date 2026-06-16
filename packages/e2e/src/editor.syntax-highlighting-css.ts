import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.syntax-highlighting-css'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const cssPath = `${tmpDir}/styles.css`
  const cssContent = `body {
  color: red;
}`

  await FileSystem.writeFile(cssPath, cssContent)
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(cssPath)

  // assert
  const propertyToken = Locator('.Token.CssPropertyName', { hasText: 'color' })
  await expect(propertyToken).toBeVisible()
}
