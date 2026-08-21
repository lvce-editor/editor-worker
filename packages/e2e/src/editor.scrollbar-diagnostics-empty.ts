import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.scrollbar-diagnostics-empty'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/empty-diagnostics.txt`
  await FileSystem.writeFile(uri, 'no problems')
  await Workspace.setPath(tmpDir)

  await Main.openUri(uri)

  await expect(Locator('.Editor .ScrollBarDiagnostics')).toHaveCount(1)
  await expect(Locator('.Editor .ScrollBarDiagnostic')).toHaveCount(0)
}
