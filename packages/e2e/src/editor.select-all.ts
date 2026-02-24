import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-select-all'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `abc\ndef`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(1, 1)

  await Editor.selectAll()

  await Editor.shouldHaveSelections(new Uint32Array([0, 0, 1, 3]))
}
