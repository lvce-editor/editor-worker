import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.alt-hover-definition-link-mouse-event'

export const test: Test = async ({ expect, Extension, FileSystem, Locator, Main }) => {
  // arrange
  const extensionUrl = import.meta.resolve('../fixtures/editor.alt-hover-definition-link')
  await Extension.addWebExtension(extensionUrl)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.dlt`, 'target\ndefinition')
  await Main.openUri(`${tmpDir}/test.dlt`)

  // act
  const editorContent = Locator('.EditorContent')
  // @ts-expect-error The test framework accepts MouseEventInit objects, but its public type still declares a string.
  await editorContent.dispatchEvent('mousemove', {
    altKey: true,
    bubbles: true,
    clientX: 0,
    clientY: 0,
  })

  // assert
  const definitionLink = Locator('.Token.EditorGoToDefinitionLink')
  await expect(definitionLink).toBeVisible()
  await expect(definitionLink).toHaveText('target')
}
