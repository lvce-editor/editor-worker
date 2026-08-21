import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.move-line-down-shortcut'

export const test: Test = async ({ Editor, FileSystem, KeyBoard, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'one\ntwo\nthree')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 1)

  await KeyBoard.press('Alt+ArrowDown')

  await Editor.shouldHaveText('two\none\nthree')
  await Editor.shouldHaveSelections(new Uint32Array([1, 1, 1, 1]))
}
