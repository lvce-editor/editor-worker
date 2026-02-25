import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-multi-cursor-add-above-and-type'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `ab\ncd\nef`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(2, 1)

  await Command.execute('Editor.addCursorAbove')
  await Editor.type('!')

  await Editor.shouldHaveText(`ab\nc!d\ne!f`)
}
