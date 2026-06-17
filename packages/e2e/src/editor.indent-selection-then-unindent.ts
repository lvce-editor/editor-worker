import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-indent-selection-then-unindent'

export const skip = 1

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'one\ntwo\nthree')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 1, 3]))

  await Command.execute('Editor.indentMore')
  await Editor.unIndent()

  await Editor.shouldHaveText('one\ntwo\nthree')
}
