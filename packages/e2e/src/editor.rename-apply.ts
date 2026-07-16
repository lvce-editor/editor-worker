import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.rename-apply'

export const test: Test = async ({ Editor, Extension, FileSystem, Main, Workspace }) => {
  // arrange
  const extensionUri = import.meta.resolve('../fixtures/editor.rename-provider')
  await Extension.addWebExtension(extensionUri)
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/main.rename-test`
  await FileSystem.writeFile(uri, 'const alpha = 1\n')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Editor.setCursor(0, 8)

  // act
  await Editor.rename2('beta')

  // assert
  await Editor.shouldHaveText('const beta = 1\n')
}
