import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.merge-conflict-scrolling'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.mergeConflictActions': true })
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/merge-conflict-scrolling.txt`
  const content = ['line 1', 'line 2', 'line 3', 'line 4', 'line 5', '<<<<<<< HEAD', 'current', '=======', 'incoming', '>>>>>>> branch', 'after']
  await FileSystem.writeFile(uri, content.join('\n'))
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Command.execute('Editor.resize', { height: 80, width: 800, x: 0, y: 0 }, 10)
  const actions = Locator('.MergeConflictActions')
  const rows = Locator('.EditorRows')

  await Editor.setDeltaY(100)
  await expect(actions).toBeVisible()
  await expect(rows).toContainText('<<<<<<< HEADcurrent=======')

  await Editor.setDeltaY(20)
  await expect(actions).toHaveCount(0)
  await expect(rows).toContainText('<<<<<<< HEADcurrent=======incoming')
}
