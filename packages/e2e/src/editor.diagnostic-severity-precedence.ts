import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.diagnostic-severity-precedence'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/diagnostic-severity.txt`
  await FileSystem.writeFile(uri, 'warning and error')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)

  const error = {
    code: 'error',
    columnIndex: 0,
    endColumnIndex: 7,
    endRowIndex: 0,
    message: 'Error diagnostic',
    rowIndex: 0,
    source: 'test',
    type: 'error' as const,
    uri,
  }
  const warning = {
    ...error,
    code: 'warning',
    message: 'Warning diagnostic',
    type: 'warning' as const,
  }

  const decorations = Locator('.LayerDiagnostics .Diagnostic')
  const errorDecoration = Locator('.LayerDiagnostics .DiagnosticError')
  const warningDecoration = Locator('.LayerDiagnostics .DiagnosticWarning')
  const lastDecorationIsError = Locator('.LayerDiagnostics .Diagnostic:last-child.DiagnosticError')
  const markers = Locator('.Editor .ScrollBarDiagnostic')
  const errorMarker = Locator('.Editor .ScrollBarDiagnosticError')
  const warningMarker = Locator('.Editor .ScrollBarDiagnosticWarning')
  const lastMarkerIsError = Locator('.Editor .ScrollBarDiagnostic:last-child.ScrollBarDiagnosticError')

  for (const diagnostics of [
    [warning, error],
    [error, warning],
  ]) {
    await Command.execute('Editor.setDiagnostics', diagnostics)
    await Editor.shouldHaveDiagnostics(diagnostics)

    await expect(decorations).toHaveCount(2)
    await expect(errorDecoration).toHaveCount(1)
    await expect(warningDecoration).toHaveCount(1)
    await expect(lastDecorationIsError).toHaveCount(1)

    await expect(markers).toHaveCount(2)
    await expect(errorMarker).toHaveCount(1)
    await expect(warningMarker).toHaveCount(1)
    await expect(lastMarkerIsError).toHaveCount(1)
  }

  await Command.execute('Editor.setDiagnostics', [warning])
  await Editor.shouldHaveDiagnostics([warning])
  await expect(decorations).toHaveCount(1)
  await expect(warningDecoration).toHaveCount(1)
  await expect(markers).toHaveCount(1)
  await expect(warningMarker).toHaveCount(1)

  await Command.execute('Editor.setDiagnostics', [error])
  await Editor.shouldHaveDiagnostics([error])
  await expect(decorations).toHaveCount(1)
  await expect(errorDecoration).toHaveCount(1)
  await expect(markers).toHaveCount(1)
  await expect(errorMarker).toHaveCount(1)
}
