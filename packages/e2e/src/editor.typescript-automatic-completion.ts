import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.typescript-automatic-completion'
// Enable after the server runtime includes completion-worker's automatic request API (PR 465).
export const skip = 1

export const test: Test = async ({ Editor, expect, Extension, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.completionsOnType': false, 'editor.diagnostics': false, 'editor.quickSuggestions': true })
  await Extension.addWebExtension(import.meta.resolve('../fixtures/editor.typescript-automatic-completion'))
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.quickts`
  await FileSystem.writeFile(uri, '')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  const completions = Locator('.EditorCompletion')
  const items = Locator('.EditorCompletionItem')

  await Editor.type('v')
  await expect(completions).toBeVisible()
  await expect(completions).toHaveCount(1)
  await expect(items).toHaveText('value')
  await Editor.type('z')
  await expect(completions).toBeHidden()
  await Editor.openCompletion()
  await expect(completions).toBeVisible()
  await expect(completions).toHaveText('No completions')
  await Editor.closeCompletion()

  const memberUri = `${tmpDir}/member.quickts`
  await FileSystem.writeFile(memberUri, 'obj')
  await Main.openUri(memberUri)
  await Editor.setCursor(0, 3)
  await Editor.type('.')
  await expect(items).toHaveText('member')
  await expect(completions).toHaveCount(1)
  await Editor.shouldHaveSelections(new Uint32Array([0, 4, 0, 4]))
  await Editor.closeCompletion()
  await expect(completions).toBeHidden()
  await Editor.shouldHaveText('obj.')
}
