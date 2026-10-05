import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.expand-selection-quick-pick'

export const test: Test = async ({ Editor, FileSystem, Main, QuickPick, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'first line\nsecond line')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 0)

  await QuickPick.open()
  await QuickPick.selectItem('Editor: Expand Selection')

  await Editor.shouldHaveSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.shouldHaveText('first line\nsecond line')
}
