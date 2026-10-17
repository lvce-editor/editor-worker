import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.alt-hover-definition-link-after-edit'

export const test: Test = async ({ Command, Editor, expect, Extension, FileSystem, Locator, Main }) => {
  // arrange
  const extensionUrl = import.meta.resolve('../fixtures/editor.alt-hover-definition-link')
  await Extension.addWebExtension(extensionUrl)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.dlt`, 'first')
  await Main.openUri(`${tmpDir}/test.dlt`)
  await Command.execute('Editor.handleMouseMove', 0, 0, true)

  // act
  await Editor.setText('second')
  await Command.execute('Editor.handleMouseMove', 0, 0, true)

  // assert
  const definitionLink = Locator('.Token.EditorGoToDefinitionLink')
  await expect(definitionLink).toBeVisible()
  await expect(definitionLink).toHaveText('second')
}
