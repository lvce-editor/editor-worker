import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-select-to-bracket'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'before {value} after')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 7)

  await Command.execute('Editor.selectToBracket')

  await Editor.shouldHaveSelections(new Uint32Array([0, 7, 0, 14]))
}
