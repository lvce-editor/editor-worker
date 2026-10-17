import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.text-drag-forward'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.dragAndDrop': true })
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/text-drag-forward.txt`
  await FileSystem.writeFile(filePath, 'alpha beta gamma')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 5]))

  await Command.execute('Editor.handleMouseDown', 0, false, false, 16, 60, 1, true)
  await Command.execute('Editor.handlePointerMove', 200, 60, false)
  await Command.execute('Editor.handlePointerUp')

  await Editor.shouldHaveText(' beta gammaalpha')
  await Editor.shouldHaveSelections(new Uint32Array([0, 11, 0, 16]))
}
