import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.shrink-selection-quick-pick'

export const test: Test = async ({ Command, Editor, FileSystem, Main, QuickPick, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'first line\nsecond line')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(1, 0)
  await Command.execute('Editor.selectUp')
  await Editor.shouldHaveSelections(new Uint32Array([1, 0, 0, 0]))

  await QuickPick.open()
  await QuickPick.selectItem('Editor: Shrink Selection')

  await Editor.shouldHaveSelections(new Uint32Array([1, 0, 1, 0]))
  await Editor.shouldHaveText('first line\nsecond line')
}
