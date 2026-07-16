import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-multi-cursor-insert-line-break-replace-selections'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'abcdef\nuvwxyz')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 2, 0, 4, 1, 2, 1, 4]))

  await Editor.insertLineBreak()

  await Editor.shouldHaveText('ab\nef\nuv\nyz')
}
