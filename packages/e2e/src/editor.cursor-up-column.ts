import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-cursor-up-column'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `first\nsecond`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(1, 2)

  await Command.execute('Editor.cursorUp')

  await Editor.shouldHaveSelections(new Uint32Array([0, 2, 0, 2]))
}
