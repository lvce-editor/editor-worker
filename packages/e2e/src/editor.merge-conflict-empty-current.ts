import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.merge-conflict-empty-current'

export const test: Test = async ({ Command, Editor, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.mergeConflictActions': true })
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/merge-conflict-empty-current.txt`
  await FileSystem.writeFile(uri, 'before\n<<<<<<< HEAD\n=======\nincoming\n>>>>>>> branch\nafter')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)

  const acceptCurrent = Locator('.MergeConflictAction', { hasText: 'Accept Current Change' })
  // eslint-disable-next-line e2e/no-direct-click -- This test verifies the rendered button wiring.
  await acceptCurrent.click()
  await Command.execute('Editor.handleMergeConflictActionsMouseDown')

  await Editor.shouldHaveText('before\n\nafter')
}
