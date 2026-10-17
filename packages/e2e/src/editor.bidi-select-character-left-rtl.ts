import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-bidi-select-character-left-rtl'

export const skip = 1

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'אבג')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 0)

  await Editor.selectCharacterLeft()

  await Editor.shouldHaveSelections(new Uint32Array([0, 0, 0, 1]))
}
