import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.merge-conflict-scrollbar-size'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.mergeConflictActions': false })
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/merge-conflict-scrollbar-size.txt`
  const lines = Array.from({ length: 20 }, (_, index) => `line ${index + 1}`)
  lines.splice(5, 5, '<<<<<<< HEAD', 'current', '=======', 'incoming', '>>>>>>> branch')
  await FileSystem.writeFile(uri, lines.join('\n'))
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Command.execute('Editor.resize', { height: 200, width: 800, x: 0, y: 0 }, 10)
  const thumb = Locator('.ScrollBarThumbVertical')
  await expect(thumb).toHaveCSS('height', '100px')

  await Settings.update({ 'editor.mergeConflictActions': true })
  await Command.execute('Editor.handleSettingsChanged')

  await expect(thumb).toHaveCSS('height', '95px')
}
