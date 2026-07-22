import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.diagnostic-squiggle-row'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.txt`, 'first\nsecond')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/test.txt`)

  await Command.execute('Editor.setDiagnostics', [
    {
      code: 1,
      columnIndex: 0,
      endColumnIndex: 1,
      endRowIndex: 1,
      message: 'error',
      rowIndex: 1,
      source: 'test',
      type: 'error',
      uri: `${tmpDir}/test.txt`,
    },
  ])

  const diagnostic = Locator('.Diagnostic')
  await expect(diagnostic).toHaveCSS('top', '20px')
}
