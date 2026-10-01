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

  // Dispatch the DOM boundary events: Locator.hover only emits mouseenter.
  await Locator('.Editor').dispatchEvent('mouseout', { bubbles: true } as any)
  await hover.dispatchEvent('mouseover', { bubbles: true } as any)
  await expect(hover).toBeVisible()

  // Leaving the hover dismisses it after a short delay.
  await hover.dispatchEvent('mouseout', { bubbles: true } as any)
  await expect(hover).toBeHidden()

  // Re-entering the editor while dismissal is pending keeps the hover available.
  await Locator('.Editor').dispatchEvent('mouseover', { bubbles: true } as any)
  await Editor.setCursor(0, 2)
  await Command.execute('Editor.showHover')
  await expect(hover).toBeVisible()
  await Locator('.Editor').dispatchEvent('mouseout', { bubbles: true } as any)
  await Locator('.Editor').dispatchEvent('mouseover', { bubbles: true } as any)
  await expect(hover).toBeVisible()
}
