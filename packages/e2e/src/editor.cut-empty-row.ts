import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.cut-empty-row'

export const test: Test = async ({ ClipBoard, Command, Editor, FileSystem, Main, Workspace }) => {
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, '\nalpha\n\nbeta\n')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  const keyX = 52
  const control = 1 << 11

  await Editor.setCursor(2, 0)
  await Command.execute('KeyBindings.handleKeyBinding', control | keyX)
  await Editor.shouldHaveText('\nalpha\nbeta\n')
  await Editor.shouldHaveSelections(new Uint32Array([2, 0, 2, 0]))

  await Editor.setCursor(0, 0)
  await Command.execute('KeyBindings.handleKeyBinding', control | keyX)
  await Editor.shouldHaveText('alpha\nbeta\n')

  await Editor.setCursor(2, 0)
  await Command.execute('KeyBindings.handleKeyBinding', control | keyX)
  await Editor.shouldHaveText('alpha\nbeta')
  await Editor.shouldHaveSelections(new Uint32Array([1, 0, 1, 0]))

  await FileSystem.writeFile(`${tmpDir}/empty.txt`, '')
  await Main.openUri(`${tmpDir}/empty.txt`)
  await Command.execute('KeyBindings.handleKeyBinding', control | keyX)
  await Editor.shouldHaveText('')
  await Editor.shouldHaveSelections(new Uint32Array([0, 0, 0, 0]))
}
