import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-type-concurrent-replace-selection'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'abcd')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 1, 0, 3]))

  await Promise.all([Command.execute('Editor.type', 'X'), Command.execute('Editor.type', 'Y')])

  await Editor.shouldHaveText('aXYd')
  await Editor.shouldHaveSelections(new Uint32Array([0, 3, 0, 3]))
}
