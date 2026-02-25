import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-cursor-character-left-start-of-file'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `abc`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 0)

  await Editor.cursorCharacterLeft()

  await Editor.shouldHaveSelections(new Uint32Array([0, 0, 0, 0]))
}
