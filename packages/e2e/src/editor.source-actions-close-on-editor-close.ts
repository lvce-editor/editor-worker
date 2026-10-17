import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.source-actions-close-on-editor-close'

export const test: Test = async ({ Editor, expect, Extension, FileSystem, Locator, Main }) => {
  // arrange
  const url = import.meta.resolve('../fixtures/editor.source-actions-execute')
  await Extension.addWebExtension(url)
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/src/source-actions-close.xyz`
  await FileSystem.writeFile(file, 'globalThis.AbortSignal.abort()')
  await Main.openUri(file)
  await Editor.setCursor(0, 11)
  await Editor.openSourceActions()
  const sourceActions = Locator('.EditorSourceActions')
  await expect(sourceActions).toBeVisible()

  // act
  await Main.closeAllEditors()

  // assert
  await expect(sourceActions).toBeHidden()
}
