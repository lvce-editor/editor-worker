import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.increment-selection-scientific'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'speed = 1.20E+03')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 10)

  await Command.execute('Editor.decrementSelection')

  await Editor.shouldHaveText('speed = 1.19E+03')
}
