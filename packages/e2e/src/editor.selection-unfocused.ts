import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.selection-unfocused'

export const test: Test = async ({ Editor, expect, FileSystem, KeyBoard, Layout, Locator, Main, SideBar, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/selection-unfocused.txt`
  await FileSystem.writeFile(filePath, 'selected text\nsecond line')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await new Promise((resolve) => setTimeout(resolve, 500))
  await Editor.setSelections(new Uint32Array([0, 0, 0, 8, 1, 0, 1, 6]))

  const selection = Locator('.EditorSelection').first()
  const cursors = Locator('.EditorCursor')
  await expect(selection).toHaveClass('EditorSelection')
  await expect(cursors).toHaveCount(2)

  await Layout.showSideBar()
  await SideBar.open('Explorer')
  await KeyBoard.press('Control+0')
  await new Promise((resolve) => setTimeout(resolve, 100))

  const explorerItems = Locator('.Explorer .ListItems')
  await expect(explorerItems).toBeFocused()
  await expect(selection).toHaveAttribute('class', 'EditorSelection SelectionUnfocused')
  await expect(cursors).toHaveCount(0)
  // No test page object exposes editor DOM focus without changing the document.
  // eslint-disable-next-line e2e/no-direct-click
  await Locator('.EditorRow').first().click()
  await new Promise((resolve) => setTimeout(resolve, 100))
  await expect(cursors).toHaveCount(1)
}
