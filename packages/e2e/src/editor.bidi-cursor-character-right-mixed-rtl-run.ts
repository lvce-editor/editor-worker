import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-bidi-cursor-character-right-mixed-rtl-run'

export const skip = 1

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'abcאבגdef')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 6)

  await Editor.cursorCharacterRight()

  await Editor.shouldHaveSelections(new Uint32Array([0, 5, 0, 5]))
}
