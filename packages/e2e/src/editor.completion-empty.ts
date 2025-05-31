import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.completion-empty'

export const skip = 1

export const test: Test = async ({ Extension, FileSystem, Workspace, Main, Editor, Locator, expect }) => {
  // arrange
  const extensionUri = import.meta.resolve('../fixtures/editor.completion-empty')
  await Extension.addWebExtension(extensionUri)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.xyz`, 'content 1')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.xyz`)
  await Editor.setCursor(0, 0)

  // act
  await Editor.openCompletion()

  // assert
  const completions = Locator('.EditorCompletion')
  await expect(completions).toBeVisible()
  await expect(completions).toHaveText('No Results')
  await expect(completions).toHaveCSS('top', '75px')
  await expect(completions).toHaveCSS('left', '0px')
}
