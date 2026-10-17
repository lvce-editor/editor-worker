import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.rename-unavailable'

export const test: Test = async ({ Editor, expect, Extension, FileSystem, Locator, Main, Workspace }) => {
  const extensionUri = import.meta.resolve('../fixtures/editor.rename-unavailable')
  await Extension.addWebExtension(extensionUri)
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  for (const languageId of ['rename-no-prepare', 'rename-rejected', 'rename-undefined']) {
    const uri = `${tmpDir}/main.${languageId}`
    await FileSystem.writeFile(uri, 'hello world\n')
    await Main.openUri(uri)
    await Editor.setCursor(0, 2)

    await Editor.openRename()

    const renameWidget = Locator('.EditorRename')
    await expect(renameWidget).toBeHidden()
    const renameHighlight = Locator('.Token.R')
    await expect(renameHighlight).toBeHidden()
    const editorInput = Locator('.EditorInput textarea')
    await expect(editorInput).toBeFocused()
    await Editor.shouldHaveText('hello world\n')
  }
}
