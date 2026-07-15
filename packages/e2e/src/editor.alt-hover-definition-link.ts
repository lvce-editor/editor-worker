import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.alt-hover-definition-link'

export const test: Test = async ({ Command, Editor, expect, Extension, FileSystem, Locator, Main }) => {
  // arrange
  const extensionUrl = import.meta.resolve('../fixtures/editor.alt-hover-definition-link')
  await Extension.addWebExtension(extensionUrl)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.dlt`, 'target\ndefinition')
  await Main.openUri(`${tmpDir}/test.dlt`)
  await Editor.setCursor(1, 3)

  // act
  await Command.execute('Editor.handleMouseMove', 0, 0, true)

  // assert
  const definitionLink = Locator('.Token.EditorGoToDefinitionLink')
  await expect(definitionLink).toBeVisible()
  await expect(definitionLink).toHaveText('target')
  await expect(definitionLink).toHaveCSS('color', 'rgb(78, 148, 206)')
  await expect(definitionLink).toHaveCSS('cursor', 'pointer')
  await expect(definitionLink).toHaveCSS('text-decoration-line', 'underline')
  await Editor.shouldHaveSelections(new Uint32Array([1, 3, 1, 3]))
}
