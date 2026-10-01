import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.hover-dismissal'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.hover': true })
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/hover-dismissal.txt`
  await FileSystem.writeFile(uri, 'abcdefgh')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Command.execute('Editor.setDiagnostics', [
    {
      code: 'hover-dismissal',
      columnIndex: 0,
      endColumnIndex: 8,
      endRowIndex: 0,
      message: 'Hover dismissal diagnostic',
      rowIndex: 0,
      source: 'hover-dismissal-test',
      type: 'error',
      uri,
    },
  ])
  const hover = Locator('.EditorHover')
  await Editor.setCursor(0, 2)
  await Command.execute('Editor.showHover')
  await expect(hover).toBeVisible()

  // Moving the pointer from the editor onto the hover keeps hover content interactive.
  await Locator('.TitleBar').hover()
  await hover.hover()
  await expect(hover).toBeVisible()

  // Leaving the hover with a real pointer event dismisses it after a short delay.
  await Locator('.TitleBar').hover()
  await expect(hover).toBeHidden()

  // Re-entering the editor while dismissal is pending keeps the hover available.
  await Locator('.Editor').hover()
  await Editor.setCursor(0, 2)
  await Command.execute('Editor.showHover')
  await expect(hover).toBeVisible()
  await Locator('.TitleBar').hover()
  await Locator('.Editor').hover()
  await expect(hover).toBeVisible()
}
