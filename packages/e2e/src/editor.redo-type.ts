import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-redo-type'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'abc')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 3)
  await Editor.type('def')

  await Editor.undo()
  await Editor.redo()

  await Editor.shouldHaveText('abcdef')
}
