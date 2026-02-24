import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-select-line'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `abc\ndef`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(1, 1)

  await Editor.selectLine()

  await Editor.shouldHaveSelections(new Uint32Array([1, 0, 1, 3]))
}
