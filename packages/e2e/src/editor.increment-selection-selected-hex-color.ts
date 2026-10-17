import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.increment-selection-selected-hex-color'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'color: #123a')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 7, 0, 12]))

  await Command.execute('Editor.incrementSelection')

  await Editor.shouldHaveText('color: #234a')
  await Editor.shouldHaveSelections(new Uint32Array([0, 7, 0, 12]))
}
