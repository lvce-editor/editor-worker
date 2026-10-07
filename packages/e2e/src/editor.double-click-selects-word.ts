import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.double-click-selects-word'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'second line with words')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Command.execute('Editor.resize', { height: 200, width: 800, x: 0, y: 0 }, 10)

  // Include the measured 30px gutter in the viewport coordinate of "line".
  await Command.execute('Editor.handleMouseDown', 0, false, false, 94, 1, 2)

  await Editor.shouldHaveSelections(new Uint32Array([0, 7, 0, 11]))
}
