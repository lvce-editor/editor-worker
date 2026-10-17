import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.increment-selection-hex-alpha'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'color: #000000fe')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 16)

  await Command.execute('Editor.incrementSelection')

  await Editor.shouldHaveText('color: #000000ff')
}
