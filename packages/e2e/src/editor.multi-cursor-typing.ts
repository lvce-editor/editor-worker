import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-multi-cursor-typing'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `one\ntwo\nthree`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 3, 0, 3, 1, 3, 1, 3, 2, 5, 2, 5]))

  await Editor.type('!')

  await Editor.shouldHaveText(`one!\ntwo!\nthree!`)
}
