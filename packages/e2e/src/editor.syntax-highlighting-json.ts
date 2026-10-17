import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.syntax-highlighting-json'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const jsonPath = `${tmpDir}/config.json`
  const jsonContent = `{
  "name": "demo",
  "enabled": true
}`

  await FileSystem.writeFile(jsonPath, jsonContent)
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(jsonPath)

  // assert
  const propertyToken = Locator('.Token.JsonPropertyName', { hasText: 'name' })
  await expect(propertyToken).toBeVisible()
}
