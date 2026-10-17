import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.increment-selection-hex-channel'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'color: #10fe20')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 10)

  await Command.execute('Editor.incrementSelection')
  await Command.execute('Editor.incrementSelection')

  await Editor.shouldHaveText('color: #10ff20')
  await Editor.shouldHaveSelections(new Uint32Array([0, 10, 0, 10]))
}
