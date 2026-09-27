import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.merge-conflict-malformed'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.mergeConflictActions': true })
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/merge-conflict-malformed.txt`
  await FileSystem.writeFile(uri, 'value <<<<<<< comparison\n<<<<<<< HEAD\ncurrent\n>>>>>>> branch\n<<<<<<< HEAD\ncurrent\n=======\nincoming')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)

  const actions = Locator('.MergeConflictActions')
  await expect(actions).toHaveCount(0)
}
