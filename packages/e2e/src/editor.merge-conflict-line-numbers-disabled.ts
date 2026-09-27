import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.merge-conflict-line-numbers-disabled'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.lineNumbers': false, 'editor.mergeConflictActions': true })
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/merge-conflict-line-numbers-disabled.txt`
  await FileSystem.writeFile(uri, '<<<<<<< HEAD\ncurrent\n=======\nincoming\n>>>>>>> branch')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Command.execute('Editor.handleSettingsChanged')

  const gutter = Locator('.Gutter')
  const actions = Locator('.MergeConflictActions')
  const actionButtons = Locator('.MergeConflictAction')
  await expect(gutter).toHaveCount(0)
  await expect(actions).toBeVisible()
  await expect(actionButtons).toHaveCount(3)
}
