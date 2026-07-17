import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.double-click-selects-word'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'second line with words')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)

  await Command.execute('Editor.handleMouseDown', 0, false, false, 64, 60, 2)

  await Editor.shouldHaveSelections(new Uint32Array([0, 7, 0, 11]))
}
