import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.completion-refreshes-diagnostics'

export const test: Test = async ({ Command, Editor, expect, Extension, FileSystem, KeyBoard, Locator, Main, Workspace }) => {
  // arrange
  await Extension.addWebExtension(import.meta.resolve('../fixtures/editor.completion-diagnostic-refresh'))
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/file.cdr`
  await FileSystem.writeFile(uri, 'bad\nvalid')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Command.execute('Editor.waitForDiagnostics')
  const diagnostics = Locator('.Diagnostic')
  await expect(diagnostics).toHaveCount(2)
  await Editor.setCursor(0, 3)

  // act
  await Editor.openCompletion()
  const completionItem = Locator('.EditorCompletionItem').first()
  await expect(completionItem).toBeVisible()
  await expect(completionItem).toHaveText('badGood')
  await KeyBoard.press('Enter')

  // assert
  await Editor.shouldHaveText('badGood\nvalid')
  await expect(diagnostics).toHaveCount(1)
  await Editor.shouldHaveDiagnostics([
    {
      columnIndex: 0,
      endColumnIndex: 1,
      endRowIndex: 1,
      message: 'Unrelated diagnostic',
      rowIndex: 1,
      type: 'error',
    },
  ])

  await Editor.type('!')
  await expect(diagnostics).toHaveCount(2)
  await Command.execute('Editor.undo')
  await Editor.shouldHaveText('badGood\nvalid')
  await expect(diagnostics).toHaveCount(1)
  await Command.execute('Editor.redo')
  await Editor.shouldHaveText('badGood!\nvalid')
  await expect(diagnostics).toHaveCount(2)
}
