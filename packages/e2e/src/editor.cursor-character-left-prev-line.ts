import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-cursor-character-left-prev-line'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `abc\ndef`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(1, 0)

  await Editor.cursorCharacterLeft()

  await Editor.shouldHaveSelections(new Uint32Array([0, 3, 0, 3]))
}
