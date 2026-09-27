import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.merge-conflict-multiple'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.mergeConflictActions': true })
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/merge-conflict-multiple.txt`
  const content =
    '<<<<<<< HEAD\ncurrent one\n=======\nincoming one\n>>>>>>> one\nmiddle\n<<<<<<< HEAD\ncurrent two\n=======\nincoming two\n>>>>>>> two'
  await FileSystem.writeFile(uri, content)
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  const actions = Locator('.MergeConflictActions')
  const actionButtons = Locator('.MergeConflictAction')
  await expect(actions).toHaveCount(2)
  await expect(actionButtons).toHaveCount(6)

  const acceptCurrent = Locator('.MergeConflictAction', { hasText: 'Accept Current Change' }).first()
  // eslint-disable-next-line e2e/no-direct-click -- This test verifies the rendered button wiring.
  await acceptCurrent.click()
  await Command.execute('Editor.handleMergeConflictActionsMouseDown')
  await expect(actions).toHaveCount(1)
  const acceptIncoming = Locator('.MergeConflictAction', { hasText: 'Accept Incoming Change' }).first()
  // eslint-disable-next-line e2e/no-direct-click -- This test verifies the rendered button wiring.
  await acceptIncoming.click()
  await Command.execute('Editor.handleMergeConflictActionsMouseDown')

  await Editor.shouldHaveText('current one\nmiddle\nincoming two')
  await expect(actions).toHaveCount(0)
}
