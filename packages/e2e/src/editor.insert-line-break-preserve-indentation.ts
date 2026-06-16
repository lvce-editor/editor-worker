import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-insert-line-break-preserve-indentation'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, '  abc')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 5)

  await Command.execute('Editor.insertLineBreak')

  await Editor.shouldHaveText('  abc\n  ')
  await Editor.shouldHaveSelections(new Uint32Array([1, 2, 1, 2]))
}
