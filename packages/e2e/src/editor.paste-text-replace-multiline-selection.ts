import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-paste-text-replace-multiline-selection'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'alpha\nbeta\ngamma')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 2, 1, 2]))

  await Command.execute('Editor.pasteText', 'INSERT')

  await Editor.shouldHaveText('alINSERTta\ngamma')
}
