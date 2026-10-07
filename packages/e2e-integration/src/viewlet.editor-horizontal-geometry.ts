import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-horizontal-geometry'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/horizontal-geometry.txt`
  const line = Array.from({ length: 1000 }, (_, index) => String(index).padStart(4, '0')).join(' ')
  await FileSystem.writeFile(uri, line)
  await Workspace.setUri(tmpDir)
  await Main.openUri(uri)
  await Editor.setCursor(0, 70)
  await Command.execute('Editor.setDiagnostics', [
    {
      columnIndex: 70,
      endColumnIndex: 74,
      endRowIndex: 0,
      message: 'Horizontal geometry regression',
      rowIndex: 0,
      source: 'horizontal-test',
      type: 'error',
      uri,
    },
  ])
  await expect(Locator('.EditorRow').first()).toContainText('0014')
  await expect(Locator('.DiagnosticError')).toHaveCount(1)
}
