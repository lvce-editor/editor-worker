import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.increment-selection-leading-zero'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'frame = 009')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 10)

  await Command.execute('Editor.incrementSelection')

  await Editor.shouldHaveText('frame = 010')
}
