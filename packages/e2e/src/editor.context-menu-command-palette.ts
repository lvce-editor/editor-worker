import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.context-menu-command-palette'

export const test: Test = async ({ ContextMenu, Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'abc')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)

  // act
  await Editor.openEditorContextMenu()
  await ContextMenu.selectItem('Command Palette')

  // assert
  const quickPick = Locator('.QuickPick')
  await expect(quickPick).toBeVisible()
}
