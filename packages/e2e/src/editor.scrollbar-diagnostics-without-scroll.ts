import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.scrollbar-diagnostics-without-scroll'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/diagnostics-without-scroll.txt`
  await FileSystem.writeFile(uri, 'first\nsecond')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)

  await Command.execute('Editor.setDiagnostics', [
    {
      code: 'first',
      columnIndex: 0,
      endColumnIndex: 5,
      endRowIndex: 0,
      message: 'First line problem',
      rowIndex: 0,
      source: 'test',
      type: 'error',
      uri,
    },
    {
      code: 'second',
      columnIndex: 0,
      endColumnIndex: 6,
      endRowIndex: 1,
      message: 'Second line problem',
      rowIndex: 1,
      source: 'test',
      type: 'warning',
      uri,
    },
  ])

  const editorRows = Locator('.EditorRow')
  const diagnosticMarkers = Locator('.Editor .ScrollBarDiagnostic')
  await expect(editorRows).toHaveCount(2)
  await expect(diagnosticMarkers).toHaveCount(2)
}
