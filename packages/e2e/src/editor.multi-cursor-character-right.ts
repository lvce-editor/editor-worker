import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-multi-cursor-character-right'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `abc\nde`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 2, 0, 2, 1, 1, 1, 1]))

  await Editor.cursorCharacterRight()

  await Editor.shouldHaveSelections(new Uint32Array([0, 3, 0, 3, 1, 2, 1, 2]))
}
