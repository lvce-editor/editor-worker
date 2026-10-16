import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.hover-dismissal'

export const test: Test = async ({ Command, Editor, expect, FileSystem, KeyBoard, Locator, Main, Settings, Workspace }) => {
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
      message: 'Hover copy payload with enough text to select and copy',
      rowIndex: 0,
      source: 'hover-dismissal-test',
      type: 'error',
      uri,
    },
  ])
  const hover = Locator('.EditorHover')
  const editorInput = Locator('.EditorInput textarea')
  await Editor.setCursor(0, 2)
  await Command.execute('Editor.showHover')
  await expect(hover).toBeVisible()

  // The hover root can receive pointer and keyboard focus.
  await expect(hover).toHaveAttribute('tabindex', '0')
  await KeyBoard.press('Escape')
  await expect(hover).toBeHidden()
  await expect(editorInput).toBeFocused()

  await Editor.setCursor(0, 2)
  await Command.execute('Editor.showHover')
  await expect(hover).toBeVisible()

  // Dispatch the DOM boundary events: Locator.hover only emits mouseenter.
  await Locator('.Editor').dispatchEvent('mouseout', { bubbles: true } as any)
  await hover.dispatchEvent('mouseover', { bubbles: true } as any)
  await new Promise((resolve) => setTimeout(resolve, 750))
  await expect(hover).toBeVisible()

  // Leaving the hover dismisses it after a short delay.
  await hover.dispatchEvent('mouseout', { bubbles: true } as any)
  await expect(hover).toBeHidden()
  await expect(editorInput).toBeFocused()

  // Re-entering the editor while dismissal is pending keeps the hover available.
  await Locator('.Editor').dispatchEvent('mouseover', { bubbles: true } as any)
  await Editor.setCursor(0, 2)
  await Command.execute('Editor.showHover')
  await expect(hover).toBeVisible()
  await Locator('.Editor').dispatchEvent('mouseout', { bubbles: true } as any)
  await Locator('.Editor').dispatchEvent('mouseover', { bubbles: true } as any)
  await new Promise((resolve) => setTimeout(resolve, 750))
  await expect(hover).toBeVisible()

  // Typing dismisses the visible hover and cancels a hover scheduled for the stationary pointer.
  await Settings.update({ 'editor.hoverDelay': 100 })
  await Command.execute('Editor.handleMouseMove', 0, 0, false)
  await Editor.type('x')
  await Editor.shouldHaveText('abxcdefgh')
  await expect(hover).toBeHidden()
  await new Promise((resolve) => setTimeout(resolve, 150))
  await expect(hover).toBeHidden()

  // A new mouse movement can show fresh hover content; beforeinput auto-closing typing dismisses it.
  await Command.execute('Editor.setDiagnostics', [
    {
      code: 'hover-dismissal',
      columnIndex: 0,
      endColumnIndex: 9,
      endRowIndex: 0,
      message: 'Updated hover content after typing',
      rowIndex: 0,
      source: 'hover-dismissal-test',
      type: 'error',
      uri,
    },
  ])
  await Command.execute('Editor.handleMouseMove', 0, 0, false)
  await expect(hover).toBeVisible()
  await expect(hover).toContainText('Updated hover content after typing')
  await Editor.setCursor(0, 3)
  await Command.execute('Editor.showHover')
  await Command.execute('Editor.handleBeforeInput', 'insertText', '(')
  await Editor.shouldHaveText('abx()cdefgh')
  await expect(hover).toBeHidden()

  // Restore the initial fixture for the native pointer-boundary regression that reuses this test.
  await Editor.setText('abcdefgh')
  await Command.execute('Editor.setDiagnostics', [
    {
      code: 'hover-dismissal',
      columnIndex: 0,
      endColumnIndex: 8,
      endRowIndex: 0,
      message: 'Hover copy payload with enough text to select and copy',
      rowIndex: 0,
      source: 'hover-dismissal-test',
      type: 'error',
      uri,
    },
  ])
  await Editor.setCursor(0, 2)
  await Command.execute('Editor.showHover')
  await expect(hover).toBeVisible()
}
