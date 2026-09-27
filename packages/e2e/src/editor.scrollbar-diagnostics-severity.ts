import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.scrollbar-diagnostics-severity'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/diagnostic-severities.txt`
  await FileSystem.writeFile(uri, 'error\nwarning\nerror')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)

  await Command.execute('Editor.setDiagnostics', [
    {
      code: 'error-one',
      columnIndex: 0,
      endColumnIndex: 5,
      endRowIndex: 0,
      message: 'First error',
      rowIndex: 0,
      source: 'test',
      type: 'error',
      uri,
    },
    {
      code: 'warning-one',
      columnIndex: 0,
      endColumnIndex: 7,
      endRowIndex: 1,
      message: 'Warning',
      rowIndex: 1,
      source: 'test',
      type: 'warning',
      uri,
    },
    {
      code: 'error-two',
      columnIndex: 0,
      endColumnIndex: 5,
      endRowIndex: 2,
      message: 'Second error',
      rowIndex: 2,
      source: 'test',
      type: 'error',
      uri,
    },
  ])

  const diagnosticMarkers = Locator('.Editor .ScrollBarDiagnostic')
  const errorMarkers = Locator('.Editor .ScrollBarDiagnosticError')
  const warningMarkers = Locator('.Editor .ScrollBarDiagnosticWarning')
  await expect(diagnosticMarkers).toHaveCount(3)
  await expect(errorMarkers).toHaveCount(2)
  await expect(warningMarkers).toHaveCount(1)
}
