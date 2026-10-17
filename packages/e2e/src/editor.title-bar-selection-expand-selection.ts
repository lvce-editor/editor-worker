import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.title-bar-selection-expand-selection'

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
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `command_exists\n`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 8)

  await selectTitleBarSelectionItem(TitleBarMenuBar, ContextMenu, 'Expand Selection')

  await Editor.shouldHaveSelections(new Uint32Array([0, 0, 0, 14]))
}
