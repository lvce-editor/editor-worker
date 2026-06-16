import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-undo-multi-cursor-typing-replace-selections'

export const skip = 1

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'hello world\nhello world')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([1, 6, 1, 11, 0, 6, 0, 11]))
  await Editor.type('editor')

  await Editor.undo()

  await Editor.shouldHaveText('hello world\nhello world')
}
