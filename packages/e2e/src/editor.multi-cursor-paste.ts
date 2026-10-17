import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-multi-cursor-paste'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'one\ntwo\nthree')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 3, 0, 3, 1, 3, 1, 3, 2, 5, 2, 5]))

  await Command.execute('Editor.pasteText', '!')

  await Editor.shouldHaveText('one!\ntwo!\nthree!')
  await Editor.shouldHaveSelections(new Uint32Array([0, 4, 0, 4, 1, 4, 1, 4, 2, 6, 2, 6]))
}
