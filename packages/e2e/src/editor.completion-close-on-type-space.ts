import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.completion-close-on-type-space'

export const skip = 1

export const test: Test = async ({ Settings, Extension, FileSystem, Workspace, Main, Editor, Locator, expect }) => {
  // arrange
  await Settings.update({
    'editor.completionsOnType': true,
  })
  const extensionUri = import.meta.resolve('../fixtures/editor.completion-close-on-type-space')
  await Extension.addWebExtension(extensionUri)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.xyz`, '')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.xyz`)
  await Editor.setCursor(0, 0)
  await Editor.type('t')
  const completions = Locator('.EditorCompletion')
  await expect(completions).toBeVisible()

  // act
  await Editor.type(' ')

  // assert
  await expect(completions).toBeHidden()
}
