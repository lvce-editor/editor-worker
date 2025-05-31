import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.completion-close'

export const skip = 1

export const test: Test = async ({ Extension, FileSystem, Workspace, Main, Editor, Locator, expect, Command }) => {
  // arrange
  const extensionUri = import.meta.resolve('../fixtures/editor.completion-one-result')
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
  const items = Locator('.EditorCompletionItem')
  await expect(items).toHaveCount(1)
  await expect(items).toHaveText('test')

  // act
  await Command.execute('Editor.closeCompletion')

  // assert
  await expect(completions).toBeHidden()
}
