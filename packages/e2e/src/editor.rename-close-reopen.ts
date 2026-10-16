import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.rename-close-reopen'

export const test: Test = async ({ Editor, expect, Extension, FileSystem, KeyBoard, Locator, Main, Workspace }) => {
  // arrange
  const extensionUri = import.meta.resolve('../fixtures/editor.rename-provider')
  await Extension.addWebExtension(extensionUri)
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/main.rename-test`
  await FileSystem.writeFile(uri, 'const alpha = 1\n')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await new Promise((resolve) => setTimeout(resolve, 100))
  await Editor.setCursor(0, 8)

  // act
  await Editor.openRename()
  const renameWidget = Locator('.EditorRename:has(.RenameInputBox:focus)')
  await expect(renameWidget).toBeVisible()
  await KeyBoard.press('Escape')
  await expect(renameWidget).toBeHidden()
  await new Promise((resolve) => setTimeout(resolve, 100))
  await Editor.openRename()

  // assert
  await expect(renameWidget).toBeVisible()
}
