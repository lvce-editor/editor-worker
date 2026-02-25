import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-multi-cursor-delete-character-left'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `abc\nxyz`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 2, 0, 2, 1, 2, 1, 2]))

  await Command.execute('Editor.deleteCharacterLeft')

  await Editor.shouldHaveText(`ac\nxz`)
}
