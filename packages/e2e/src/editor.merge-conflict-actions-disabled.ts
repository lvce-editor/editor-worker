import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.merge-conflict-actions-disabled'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.mergeConflictActions': false })
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/merge-conflict-actions-disabled.txt`
  await FileSystem.writeFile(uri, 'before\n<<<<<<< HEAD\ncurrent\n=======\nincoming\n>>>>>>> branch\nafter')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)

  const actions = Locator('.MergeConflictActions')
  const actionButtons = Locator('.MergeConflictAction')
  await expect(actions).toHaveCount(0)
  await expect(actionButtons).toHaveCount(0)
}
