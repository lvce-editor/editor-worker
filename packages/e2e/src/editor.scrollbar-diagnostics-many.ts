import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.scrollbar-diagnostics-many'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/many-diagnostics.txt`
  await FileSystem.writeFile(uri, Array.from({ length: 100 }, (_, index) => `line ${index + 1}`).join('\n'))
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)

  const diagnostics = [0, 9, 24, 49, 74, 99].map((rowIndex) => ({
    code: `problem-${rowIndex}`,
    columnIndex: 0,
    endColumnIndex: 4,
    endRowIndex: rowIndex,
    message: `Problem on line ${rowIndex + 1}`,
    rowIndex,
    source: 'test',
    type: 'error',
    uri,
  }))
  await Command.execute('Editor.setDiagnostics', diagnostics)

  await expect(Locator('.Editor .ScrollBarDiagnostic')).toHaveCount(6)
}
