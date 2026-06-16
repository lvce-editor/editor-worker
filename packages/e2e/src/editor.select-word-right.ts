import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-select-word-right'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `foo bar`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 0)

  await Command.execute('Editor.selectWordRight')

  await Editor.shouldHaveSelections(new Uint32Array([0, 0, 0, 3]))
}
