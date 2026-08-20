import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.diagnostic-navigation'

export const test: Test = async ({ Command, Editor, expect, FileSystem, KeyBoard, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.txt`
  await FileSystem.writeFile(uri, 'first\nsecond\nthird')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Command.execute('Editor.setDiagnostics', [
    {
      code: 'second-rule',
      columnIndex: 0,
      endColumnIndex: 5,
      endRowIndex: 2,
      message: 'Second diagnostic',
      rowIndex: 2,
      source: 'diagnostic-test',
      type: 'warning',
      uri,
    },
    {
      code: 'first-rule',
      columnIndex: 0,
      endColumnIndex: 5,
      endRowIndex: 0,
      message: 'First diagnostic',
      rowIndex: 0,
      source: 'diagnostic-test',
      type: 'error',
      uri,
    },
  ])
  await Editor.setCursor(0, 0)

  await KeyBoard.press('F8')
  await new Promise((resolve) => setTimeout(resolve, 100))
  await Editor.shouldHaveSelections(new Uint32Array([2, 0, 2, 5]))
  const hover = Locator('.EditorHover')
  await expect(hover).toBeVisible()
  await expect(hover).toContainText('Second diagnostic')
  await expect(hover).toContainText('diagnostic-test (second-rule)')

  await KeyBoard.press('Shift+F8')
  await new Promise((resolve) => setTimeout(resolve, 100))
  await Editor.shouldHaveSelections(new Uint32Array([0, 0, 0, 5]))
  await expect(hover).toContainText('First diagnostic')

  await KeyBoard.press('Shift+F8')
  await new Promise((resolve) => setTimeout(resolve, 100))
  await Editor.shouldHaveSelections(new Uint32Array([2, 0, 2, 5]))
  await expect(hover).toContainText('Second diagnostic')

  await KeyBoard.press('F8')
  await new Promise((resolve) => setTimeout(resolve, 100))
  await Editor.shouldHaveSelections(new Uint32Array([0, 0, 0, 5]))
  await expect(hover).toContainText('First diagnostic')
}
