import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.scrollbar-diagnostics-empty'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/empty-diagnostics.txt`
  await FileSystem.writeFile(uri, 'no problems')
  await Workspace.setPath(tmpDir)

  await Main.openUri(uri)

  const diagnosticTrack = Locator('.Editor .ScrollBarDiagnostics')
  const diagnosticMarkers = Locator('.Editor .ScrollBarDiagnostic')
  await expect(diagnosticTrack).toHaveCount(1)
  await expect(diagnosticMarkers).toHaveCount(0)
}
