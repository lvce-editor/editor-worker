import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.decrement-selection-quick-pick'

export const test: Test = async ({ Editor, FileSystem, Main, QuickPick, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'opacity = 0.75')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 12)

  await QuickPick.open()
  await QuickPick.selectItem('Editor: Decrement Selection')

  await Editor.shouldHaveText('opacity = 0.74')
}
