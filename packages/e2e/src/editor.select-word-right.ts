import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-select-word-right'

export const test: Test = async ({ Editor, FileSystem, KeyBoard, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `foo bar\nbaz`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 0)

  for (let i = 0; i < 10; i++) {
    await KeyBoard.press('Control+Shift+ArrowRight')
  }

  await Editor.shouldHaveSelections(new Uint32Array([0, 0, 1, 3]))
}
