import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.increment-selection-undo'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'x = 1\ny = 2')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 4, 0, 4, 1, 4, 1, 4]))
  await Command.execute('Editor.incrementSelection')

  await Command.execute('Editor.undo')

  await Editor.shouldHaveText('x = 1\ny = 2')
}
