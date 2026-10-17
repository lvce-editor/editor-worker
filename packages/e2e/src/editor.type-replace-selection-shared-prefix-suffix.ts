import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-type-replace-selection-shared-prefix-suffix'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'foo\nbar')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 1, 1, 2]))

  await Editor.type('o--a')

  await Editor.shouldHaveText('fo--ar')
}
