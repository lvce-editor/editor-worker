import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.merge-conflict-click-placement'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.mergeConflictActions': true })
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/merge-conflict-click-placement.txt`
  await FileSystem.writeFile(uri, 'before\n<<<<<<< HEAD\ncurrent\n=======\nincoming\n>>>>>>> branch\nafter')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Command.execute('Editor.resize', { height: 200, width: 800, x: 0, y: 0 }, 10)

  await Command.execute('Editor.handleSingleClick', 0, 0, 61)

  await Editor.shouldHaveSelections(new Uint32Array([2, 0, 2, 0]))
}
