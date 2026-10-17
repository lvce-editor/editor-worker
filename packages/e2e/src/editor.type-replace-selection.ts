import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-type-replace-selection'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'hello world')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 6, 0, 11]))

  await Editor.type('editor')

  await Editor.shouldHaveText('hello editor')
}
