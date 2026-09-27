import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.merge-conflict-accept-current'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.mergeConflictActions': true })
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/merge-conflict-accept-current.txt`
  await FileSystem.writeFile(uri, 'before\n<<<<<<< HEAD\ncurrent\n=======\nincoming\n>>>>>>> branch\nafter')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)

  const acceptCurrent = Locator('.MergeConflictAction', { hasText: 'Accept Current Change' })
  // eslint-disable-next-line e2e/no-direct-click -- This test verifies the rendered button wiring.
  await acceptCurrent.click()
  await Command.execute('Editor.handleMergeConflictActionsMouseDown')

  await Editor.shouldHaveText('before\ncurrent\nafter')
  await Editor.shouldHaveSelections(new Uint32Array([1, 0, 1, 0]))
  const actions = Locator('.MergeConflictActions')
  await expect(actions).toHaveCount(0)
}
