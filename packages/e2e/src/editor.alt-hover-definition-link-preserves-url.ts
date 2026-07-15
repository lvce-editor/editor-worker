import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.alt-hover-definition-link-preserves-url'

export const test: Test = async ({ Command, expect, Extension, FileSystem, Locator, Main }) => {
  // arrange
  const extensionUrl = import.meta.resolve('../fixtures/editor.alt-hover-definition-link')
  await Extension.addWebExtension(extensionUrl)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.dlt`, 'https://example.com')
  await Main.openUri(`${tmpDir}/test.dlt`)

  // act
  await Command.execute('Editor.handleMouseMove', 0, 0, true)
  await Command.execute('Editor.handleMouseMove', 0, 0, false)

  // assert
  const urlLink = Locator('.Token.Link')
  const definitionLink = Locator('.Token.EditorGoToDefinitionLink')
  await expect(urlLink).toBeVisible()
  await expect(urlLink).toHaveText('https://example.com')
  await expect(definitionLink).toBeHidden()
}
