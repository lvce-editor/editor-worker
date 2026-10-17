import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.gutter-pointer-cursor-placement'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.lineNumbers': true })
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/gutter-pointer-cursor-placement.txt`
  await FileSystem.writeFile(filePath, 'alpha bravo charlie')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Command.execute('Editor.resize', { height: 600, width: 800, x: 0, y: 0 }, 10)
  await Command.execute('Editor.handlePointerDown', 0, false, false, 31, 1, 1, 30)
  await Command.execute('Editor.handleMouseDown', 0, false, false, 31, 1, 1)

  await Editor.shouldHaveSelections(new Uint32Array([0, 0, 0, 0]))
}
