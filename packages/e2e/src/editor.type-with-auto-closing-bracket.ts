import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-type-with-auto-closing-bracket'

export const skip = 1

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, '')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 0)

  await Command.execute('Editor.typeWithAutoClosing', '(')

  await Editor.shouldHaveText('()')
  await Editor.shouldHaveSelections(new Uint32Array([0, 1, 0, 1]))
}
