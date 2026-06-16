import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.syntax-highlighting-yaml'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const yamlPath = `${tmpDir}/config.yaml`
  const yamlContent = `name: demo
enabled: true`

  await FileSystem.writeFile(yamlPath, yamlContent)
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(yamlPath)

  // assert
  const propertyToken = Locator('.Token.YamlPropertyName', { hasText: 'name' })
  await expect(propertyToken).toBeVisible()
}
