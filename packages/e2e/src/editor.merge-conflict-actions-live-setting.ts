import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.merge-conflict-actions-live-setting'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.mergeConflictActions': false })
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/merge-conflict-actions-live-setting.txt`
  await FileSystem.writeFile(uri, '<<<<<<< HEAD\ncurrent\n=======\nincoming\n>>>>>>> branch')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  const actions = Locator('.MergeConflictActions')
  await expect(actions).toHaveCount(0)

  await Settings.update({ 'editor.mergeConflictActions': true })
  await Command.execute('Editor.handleSettingsChanged')
  await expect(actions).toHaveCount(1)

  await Settings.update({ 'editor.mergeConflictActions': false })
  await Command.execute('Editor.handleSettingsChanged')
  await expect(actions).toHaveCount(0)
}
