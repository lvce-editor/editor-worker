import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.increment-selection-float'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'opacity = 0.75')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 12)

  await Command.execute('Editor.incrementSelection')

  await Editor.shouldHaveText('opacity = 0.76')
}
