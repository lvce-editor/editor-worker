import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.increment-selection-selected-float'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'opacity: .9')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 9, 0, 11]))

  await Command.execute('Editor.incrementSelection')

  await Editor.shouldHaveText('opacity: 1.0')
  await Editor.shouldHaveSelections(new Uint32Array([0, 9, 0, 12]))
}
