import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.merge-conflict-accept-both'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.mergeConflictActions': true })
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/merge-conflict-accept-both.txt`
  await FileSystem.writeFile(uri, 'before\n<<<<<<< HEAD\ncurrent one\ncurrent two\n=======\nincoming one\nincoming two\n>>>>>>> branch\nafter')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)

  const acceptBoth = Locator('.MergeConflictAction', { hasText: 'Accept Both Changes' })
  // eslint-disable-next-line e2e/no-direct-click -- This test verifies the rendered button wiring.
  await acceptBoth.click()
  await Command.execute('Editor.handleMergeConflictActionsMouseDown')

  await Editor.shouldHaveText('before\ncurrent one\ncurrent two\nincoming one\nincoming two\nafter')
  const actions = Locator('.MergeConflictActions')
  await expect(actions).toHaveCount(0)
}
