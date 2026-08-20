import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-type-concurrent-three-characters'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'abc')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 3)

  await Promise.all([Command.execute('Editor.type', 'd'), Command.execute('Editor.type', 'e'), Command.execute('Editor.type', 'f')])

  await Editor.shouldHaveText('abcdef')
  await Editor.shouldHaveSelections(new Uint32Array([0, 6, 0, 6]))
}
