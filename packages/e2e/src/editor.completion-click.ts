import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.completion-click'

export const skip = 1

export const test: Test = async ({ Editor, EditorCompletion, expect, Extension, FileSystem, Locator, Main, Workspace }) => {
  const extensionUri = import.meta.resolve('../fixtures/editor.completion-click')
  await Extension.addWebExtension(extensionUri)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.xyz`, '')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.xyz`)
  await Editor.setCursor(0, 0)

  await Editor.openCompletion()
  const item = Locator('.EditorCompletionItem', { hasText: 'test' })
  await expect(item).toBeVisible()
  await EditorCompletion.selectIndex(0)

  await Editor.shouldHaveText('test')
  const completions = Locator('.EditorCompletion')
  await expect(completions).toBeHidden()
}
