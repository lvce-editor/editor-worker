import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.copy-reversed-selection'

export const test: Test = async ({ ClipBoard, Command, Editor, FileSystem, Main, Workspace }) => {
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/file1.txt`
  await FileSystem.writeFile(filePath, 'alpha beta\ngamma delta\nepsilon')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Editor.setSelections(new Uint32Array([2, 3, 0, 2]))

  await Command.execute('Editor.copy')

  await ClipBoard.shouldHaveText('pha beta\ngamma delta\neps')
}
