import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-select-character-left'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `abc`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 1)

  await Command.execute('Editor.selectCharacterLeft')

  await Editor.shouldHaveSelections(new Uint32Array([0, 1, 0, 0]))
}
