import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-multi-cursor-typing-mixed-cursors-and-selection'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `hello world\nfoo bar`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 5, 0, 5, 1, 4, 1, 7]))

  await Editor.type('-')

  await Editor.shouldHaveText(`hello- world\nfoo -`)
}
