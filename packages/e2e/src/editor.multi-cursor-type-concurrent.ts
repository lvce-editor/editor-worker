import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-multi-cursor-type-concurrent'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `one\ntwo`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 3, 0, 3, 1, 3, 1, 3]))

  await Promise.all([Command.execute('Editor.type', '!'), Command.execute('Editor.type', '?')])

  await Editor.shouldHaveText(`one!?\ntwo!?`)
  await Editor.shouldHaveSelections(new Uint32Array([0, 5, 0, 5, 1, 5, 1, 5]))
}
