import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.scrollbar-diagnostics-update'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/updated-diagnostics.txt`
  await FileSystem.writeFile(uri, 'one\ntwo\nthree')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  const createDiagnostic = (rowIndex: number) => ({
    code: `problem-${rowIndex}`,
    columnIndex: 0,
    endColumnIndex: 3,
    endRowIndex: rowIndex,
    message: `Problem ${rowIndex}`,
    rowIndex,
    source: 'test',
    type: 'error',
    uri,
  })
  const diagnosticMarkers = Locator('.Editor .ScrollBarDiagnostic')

  await Command.execute('Editor.setDiagnostics', [createDiagnostic(0), createDiagnostic(1), createDiagnostic(2)])
  await expect(diagnosticMarkers).toHaveCount(3)

  await Command.execute('Editor.setDiagnostics', [createDiagnostic(1)])
  await expect(diagnosticMarkers).toHaveCount(1)

  await Command.execute('Editor.setDiagnostics', [])
  await expect(diagnosticMarkers).toHaveCount(0)
}
