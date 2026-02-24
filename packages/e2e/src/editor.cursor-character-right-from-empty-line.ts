import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-cursor-character-right-from-empty-line'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `abc\n\ndef`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(1, 0)

  await Editor.cursorCharacterRight()

  await Editor.shouldHaveSelections(new Uint32Array([2, 0, 2, 0]))
}
