import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.rename-open'

export const test: Test = async ({ Editor, expect, Extension, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const extensionUri = import.meta.resolve('../fixtures/editor.rename-provider')
  await Extension.addWebExtension(extensionUri)
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/main.rename-test`
  await FileSystem.writeFile(uri, 'const alpha = alpha\n')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await new Promise((resolve) => setTimeout(resolve, 100))
  await Editor.setCursor(0, 8)

  // act
  await Editor.openRename()

  // assert
  const renameWidget = Locator('.EditorRename:has(.RenameInputBox:focus)')
  await expect(renameWidget).toBeVisible()
  const renameInput = Locator('.RenameInputBox:focus')
  await expect(renameInput).toBeVisible()
  await expect(renameInput).toBeFocused()
  const renameHighlight = Locator('.Token.R')
  await expect(renameHighlight).toHaveText('alpha')
  await expect(renameHighlight).toHaveCSS('background-color', 'rgba(173, 214, 255, 0.25)')
}
