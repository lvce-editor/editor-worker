import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.selection-unfocused'

export const test: Test = async ({ Command, Editor, expect, Explorer, FileSystem, Layout, Locator, Main, SideBar, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/selection-unfocused.txt`
  await FileSystem.writeFile(filePath, 'selected text')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await new Promise((resolve) => setTimeout(resolve, 500))
  await Editor.setSelections(new Uint32Array([0, 0, 0, 8]))

  const selection = Locator('.EditorSelection')
  await expect(selection).toHaveClass('EditorSelection')

  await Layout.showSideBar()
  await SideBar.open('Explorer')
  await Command.execute('Explorer.focus')
  await Explorer.focusIndex(0)
  await Command.execute('Editor.handleBlur')
  await new Promise((resolve) => setTimeout(resolve, 100))

  const explorerItems = Locator('.Explorer .ListItems')
  await expect(explorerItems).toBeFocused()
  await expect(selection).toHaveAttribute('class', 'EditorSelection SelectionUnfocused')
  await Command.execute('Editor.handleFocus')
  await new Promise((resolve) => setTimeout(resolve, 100))
  await expect(selection).toHaveAttribute('class', 'EditorSelection')
}
