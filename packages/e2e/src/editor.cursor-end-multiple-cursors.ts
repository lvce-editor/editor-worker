import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-cursor-end-multiple-cursors'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `abcde\nxyz`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 1, 0, 1, 0, 3, 0, 3, 1, 1, 1, 1]))
  await Editor.cursorEnd()

  await Editor.shouldHaveSelections(new Uint32Array([0, 5, 0, 5, 1, 3, 1, 3]))
  await Editor.type('!')

  await Editor.shouldHaveText(`abcde!\nxyz!`)
}
