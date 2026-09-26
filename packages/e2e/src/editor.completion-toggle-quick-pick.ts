import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.completion-toggle-quick-pick'

export const test: Test = async ({ Editor, expect, Extension, FileSystem, Locator, Main, QuickPick, Workspace }) => {
  const extensionUri = import.meta.resolve('../fixtures/editor.completion-one-result')
  await Extension.addWebExtension(extensionUri)
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/file.xyz`
  await FileSystem.writeFile(file, 'content')
  await Workspace.setPath(tmpDir)
  await Main.openUri(file)
  await Editor.setCursor(0, 0)

  const completions = Locator('.EditorCompletion')
  await expect(completions).toBeHidden()

  await QuickPick.open()
  await QuickPick.selectItem('Editor: Toggle Suggest Widget')
  await expect(completions).toBeVisible()

  await QuickPick.open()
  await QuickPick.selectItem('Editor: Toggle Suggest Widget')
  await expect(completions).toBeHidden()

  await QuickPick.open()
  await QuickPick.selectItem('Editor: Toggle Suggest Widget')
  await expect(completions).toBeVisible()
}
