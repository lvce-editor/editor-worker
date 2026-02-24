import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-cursor-word-part-right-camel'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `myHTTPServer`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 2)

  await Editor.cursorWordPartRight()

  await Editor.shouldHaveSelections(new Uint32Array([0, 6, 0, 6]))
}
