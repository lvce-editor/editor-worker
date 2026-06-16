import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-toggle-line-comment-selection-js'

export const skip = 1

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.js`, 'const one = 1\nconst two = 2')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.js`)
  await Editor.setSelections(new Uint32Array([0, 0, 1, 13]))

  await Editor.toggleLineComment()

  await Editor.shouldHaveText('// const one = 1\n// const two = 2')
}
