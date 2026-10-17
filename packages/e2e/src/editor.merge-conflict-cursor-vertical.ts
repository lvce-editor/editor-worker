import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.merge-conflict-cursor-vertical'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.mergeConflictActions': true })
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/merge-conflict-cursor-vertical.txt`
  await FileSystem.writeFile(uri, 'before\n<<<<<<< HEAD\ncurrent\n=======\nincoming\n>>>>>>> branch\nafter')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Command.execute('Editor.resize', { height: 200, width: 800, x: 0, y: 0 }, 10)
  await Editor.setCursor(0, 0)
  const cursor = Locator('.EditorCursor')

  await Editor.cursorDown()

  await Editor.shouldHaveSelections(new Uint32Array([1, 0, 1, 0]))
  await expect(cursor).toHaveCSS('translate', '0px 40px')

  await Editor.cursorUp()
  await Editor.shouldHaveSelections(new Uint32Array([0, 0, 0, 0]))
  await expect(cursor).toHaveCSS('translate', '0px')
}
