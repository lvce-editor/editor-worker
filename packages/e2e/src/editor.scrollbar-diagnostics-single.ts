import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.scrollbar-diagnostics-single'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/single-diagnostic.txt`
  await FileSystem.writeFile(uri, 'problem')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)

  await Command.execute('Editor.setDiagnostics', [
    {
      code: 'single',
      columnIndex: 0,
      endColumnIndex: 7,
      endRowIndex: 0,
      message: 'Single diagnostic',
      rowIndex: 0,
      source: 'test',
      type: 'error',
      uri,
    },
  ])

  const diagnosticMarkers = Locator('.Editor .ScrollBarDiagnostic')
  const errorMarkers = Locator('.Editor .ScrollBarDiagnosticError')
  await expect(diagnosticMarkers).toHaveCount(1)
  await expect(errorMarkers).toHaveCount(1)
}
