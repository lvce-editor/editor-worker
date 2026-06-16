import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-insert-line-break-middle'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'abcd')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 2)

  await Editor.insertLineBreak()

  await Editor.shouldHaveText('ab\ncd')
  await Editor.shouldHaveSelections(new Uint32Array([1, 0, 1, 0]))
}
