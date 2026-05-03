import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.title-bar-selection-copy-line-up'

export const skip = 1

const selectTitleBarSelectionItem = async (
  TitleBarMenuBar: { toggleIndex: (index: number) => Promise<void>; closeMenu: () => Promise<void> },
  ContextMenu: { selectItem: (label: string) => Promise<void> },
  label: string,
) => {
  for (let index = 0; index < 8; index++) {
    try {
      await TitleBarMenuBar.toggleIndex(index)
      await ContextMenu.selectItem(label)
      return
    } catch {
      await TitleBarMenuBar.closeMenu()
    }
  }
  throw new Error(`title bar selection menu item not found: ${label}`)
}

export const test: Test = async ({ ContextMenu, Editor, FileSystem, Main, TitleBarMenuBar, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `line 1\nline 2\nline 3`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(2, 0)

  await selectTitleBarSelectionItem(TitleBarMenuBar, ContextMenu, 'Copy Line Up')

  await Editor.shouldHaveText(`line 1\nline 2\nline 3\nline 3`)
  await Editor.shouldHaveSelections(new Uint32Array([3, 0, 3, 0]))
}
