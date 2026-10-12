import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.typescript-automatic-completion'

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

  for (const [index, opening] of ['"', "'", '`', '//', '/*\n'].entries()) {
    const contextUri = `${tmpDir}/context-${index}.quickts`
    await FileSystem.writeFile(contextUri, '')
    await Main.openUri(contextUri)
    await Editor.type('v')
    await expect(completions).toBeVisible()
    await Editor.setCursor(0, 0)
    await Editor.type(opening)
    await expect(completions).toBeHidden()
  }

  const templateUri = `${tmpDir}/template.quickts`
  const templatePrefix = 'const text = `template ${obj'
  await FileSystem.writeFile(templateUri, templatePrefix)
  await Main.openUri(templateUri)
  await Editor.setCursor(0, templatePrefix.length)
  await Editor.type('.')
  await Editor.shouldHaveText(`${templatePrefix}.`)
  await expect(items).toHaveText('member')
}
