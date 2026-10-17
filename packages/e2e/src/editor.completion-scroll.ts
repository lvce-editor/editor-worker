import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.completion-scroll'

export const skip = 1

export const test: Test = async ({ Editor, EditorCompletion, expect, Extension, FileSystem, Locator, Main, Workspace }) => {
  const extensionUri = import.meta.resolve('../fixtures/editor.completion-scroll')
  await Extension.addWebExtension(extensionUri)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.xyz`, '')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.xyz`)
  await Editor.setCursor(0, 0)

  await Editor.openCompletion()
  await EditorCompletion.handleWheel(0, 2000)

  const laterItem = Locator('.EditorCompletionItem', { hasText: 'test 20' })
  await expect(laterItem).toBeVisible()
}
