import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.merge-conflict-accept-incoming'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.mergeConflictActions': true })
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/merge-conflict-accept-incoming.txt`
  await FileSystem.writeFile(uri, 'before\n<<<<<<< HEAD\ncurrent\n=======\nincoming\n>>>>>>> branch\nafter')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)

  const acceptIncoming = Locator('.MergeConflictAction', { hasText: 'Accept Incoming Change' })
  // eslint-disable-next-line e2e/no-direct-click -- This test verifies the rendered button wiring.
  await acceptIncoming.click()
  await Command.execute('Editor.handleMergeConflictActionsMouseDown')

  await Editor.shouldHaveText('before\nincoming\nafter')
  const actions = Locator('.MergeConflictActions')
  await expect(actions).toHaveCount(0)
}
