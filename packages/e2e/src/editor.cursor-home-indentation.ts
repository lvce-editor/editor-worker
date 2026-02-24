import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-cursor-home-indentation'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `  abc`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 5)

  await Editor.cursorHome()

  await Editor.shouldHaveSelections(new Uint32Array([0, 2, 0, 2]))
}
