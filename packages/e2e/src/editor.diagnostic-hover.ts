import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.diagnostic-hover'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  // arrange
  await Settings.update({ 'editor.hover': true })
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.txt`
  await FileSystem.writeFile(uri, 'abcdefgh')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Command.execute('Editor.setDiagnostics', [
    {
      code: 'rule-a',
      columnIndex: 0,
      endColumnIndex: 8,
      endRowIndex: 0,
      message: 'Example diagnostic',
      rowIndex: 0,
      source: 'diagnostic-test',
      type: 'error',
      uri,
    },
  ])
  const diagnostic = Locator('.Diagnostic')
  await expect(diagnostic).toBeVisible()

  // act
  await Editor.setCursor(0, 2)
  await Command.execute('Editor.showHover')

  // assert
  const hover = Locator('.EditorHover')
  await expect(hover).toBeVisible()
  await expect(hover).toContainText('Example diagnostic')
  await expect(hover).toContainText('diagnostic-test (rule-a)')
  await expect(hover).toHaveCSS('height', '36px')
  await expect(hover).toHaveCSS('top', '75px')

  // act
  await Editor.cancelSelection()

  // assert
  await expect(hover).toBeHidden()

  // act
  await Command.execute('Editor.showHover')

  // assert
  await expect(hover).toBeVisible()

  // act
  await Editor.setCursor(0, 8)
  await Command.execute('Editor.showHover')

  // assert
  await expect(hover).toBeHidden()
}
