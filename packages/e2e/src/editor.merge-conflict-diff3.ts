import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.merge-conflict-diff3'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.mergeConflictActions': true })
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/merge-conflict-diff3.txt`
  await FileSystem.writeFile(uri, '<<<<<<< HEAD\ncurrent\n||||||| base\noriginal\n=======\nincoming\n>>>>>>> branch')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  const actions = Locator('.MergeConflictActions')
  await expect(actions).toHaveCount(1)

  const acceptIncoming = Locator('.MergeConflictAction', { hasText: 'Accept Incoming Change' })
  // eslint-disable-next-line e2e/no-direct-click -- This test verifies the rendered button wiring.
  await acceptIncoming.click()
  await Command.execute('Editor.handleMergeConflictActionsMouseDown')

  await Editor.shouldHaveText('incoming')
  await expect(actions).toHaveCount(0)
}
