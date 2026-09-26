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
  await Editor.closeCompletion()
  const expectVisibility = async (isVisible: boolean, failureMessage: string) => {
    try {
      if (isVisible) {
        await expect(completions).toBeVisible()
      } else {
        await expect(completions).toBeHidden()
      }
    } catch {
      throw new Error(failureMessage)
    }
  }
  await expectVisibility(false, 'Editor.closeCompletion did not close the initial completion widget')

  await QuickPick.open()
  await QuickPick.selectItem('Editor: Toggle Suggest Widget')
  await expectVisibility(true, 'The first palette toggle did not open completion')

  await QuickPick.open()
  await expectVisibility(false, 'Opening the palette did not dismiss completion')
  await QuickPick.selectItem('Editor: Toggle Suggest Widget')
  await expectVisibility(false, 'The second palette toggle did not close completion')

  await QuickPick.open()
  await QuickPick.selectItem('Editor: Toggle Suggest Widget')
  await expectVisibility(true, 'The third palette toggle did not reopen completion')
}
