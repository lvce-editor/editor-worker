import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.completion-reopen-on-type-character'

export const test: Test = async ({ Settings, Extension, FileSystem, Workspace, Main, Editor, Locator, expect }) => {
  // arrange
  await Settings.update({
    'editor.completionsOnType': true,
    'editor.diagnostics': false,
  })
  const extensionUri = import.meta.resolve('../fixtures/editor.completion-reopen-on-type-character')
  await Extension.addWebExtension(extensionUri)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.xyz`, '')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.xyz`)
  await Editor.setCursor(0, 0)
  await Editor.type('t')
  const completions = Locator('.EditorCompletion')
  await expect(completions).toBeVisible()
  await Editor.type(' ')
  await expect(completions).toBeHidden()

  // act
  await Editor.type('e')

  // assert
  await expect(completions).toBeVisible()
}
