import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.merge-conflict-actions-visible'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.mergeConflictActions': true })
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/merge-conflict-actions-visible.txt`
  await FileSystem.writeFile(uri, 'before\n<<<<<<< HEAD\ncurrent\n=======\nincoming\n>>>>>>> branch\nafter')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)

  const actions = Locator('.MergeConflictActions')
  const actionButtons = Locator('.MergeConflictAction')
  const acceptCurrent = actionButtons.nth(0)
  const acceptIncoming = actionButtons.nth(1)
  const acceptBoth = actionButtons.nth(2)
  await expect(actions).toHaveCount(1)
  await expect(actions).toHaveCSS('height', '20px')
  await expect(actionButtons).toHaveCount(3)
  await expect(acceptCurrent).toHaveText('Accept Current Change')
  await expect(acceptIncoming).toHaveText('Accept Incoming Change')
  await expect(acceptBoth).toHaveText('Accept Both Changes')
}
