import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-go-to-bracket'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, '{\n  ([value])\n}')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(1, 2)

  await Command.execute('Editor.goToBracket')

  await Editor.shouldHaveSelections(new Uint32Array([1, 10, 1, 10]))
  await Command.execute('Editor.goToBracket')
  await Editor.shouldHaveSelections(new Uint32Array([1, 2, 1, 2]))
}
