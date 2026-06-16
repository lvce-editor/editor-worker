import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-delete-character-right-replace-selection'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'abcdef')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 2, 0, 4]))

  await Command.execute('Editor.deleteCharacterRight')

  await Editor.shouldHaveText('abef')
}
