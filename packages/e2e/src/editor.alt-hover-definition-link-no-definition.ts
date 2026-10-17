import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.alt-hover-definition-link-no-definition'

export const test: Test = async ({ Command, expect, Extension, FileSystem, Locator, Main }) => {
  // arrange
  const extensionUrl = import.meta.resolve('../fixtures/editor.alt-hover-definition-link')
  await Extension.addWebExtension(extensionUrl)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.dlt`, 'missing')
  await Main.openUri(`${tmpDir}/test.dlt`)

  // act
  await Command.execute('Editor.handleMouseMove', 0, 0, true)

  // assert
  const definitionLink = Locator('.Token.EditorGoToDefinitionLink')
  await expect(definitionLink).toBeHidden()
}
