import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.rename-apply'

export const test: Test = async ({ Editor, expect, Extension, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const extensionUri = import.meta.resolve('../fixtures/editor.rename-provider')
  await Extension.addWebExtension(extensionUri)
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/main.rename-test`
  await FileSystem.writeFile(uri, 'const alpha = 1\n')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  const editorInput = Locator('.EditorInput textarea')
  await expect(editorInput).toBeFocused()
  await Editor.setCursor(0, 8)

  // act
  await Editor.rename2('beta')

  // assert
  await Editor.shouldHaveText('const beta = 1\n')
}
