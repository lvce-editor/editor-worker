import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-multi-cursor-selection-character-right'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `abcd\nwxyz`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 1, 0, 1, 1, 1, 1, 1]))

  await Command.execute('Editor.selectCharacterRight')

  await Editor.shouldHaveSelections(new Uint32Array([0, 1, 0, 2, 1, 1, 1, 2]))
}
