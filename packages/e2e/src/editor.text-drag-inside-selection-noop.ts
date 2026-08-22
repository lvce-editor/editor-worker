import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.text-drag-inside-selection-noop'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/text-drag-inside-selection-noop.txt`
  await FileSystem.writeFile(filePath, 'alpha beta gamma')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Editor.setSelections(new Uint32Array([0, 6, 0, 10]))

  await Command.execute('Editor.handleMouseDown', 0, false, false, 64, 60, 1, true)
  await Command.execute('Editor.handlePointerMove', 72, 60, false)
  await Command.execute('Editor.handlePointerUp')

  await Editor.shouldHaveText('alpha beta gamma')
  await Editor.shouldHaveSelections(new Uint32Array([0, 6, 0, 10]))
}
