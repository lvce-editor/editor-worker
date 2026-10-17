import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-toggle-line-comment-selection-ts-shortcut'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const originalText = 'const one: number = 1\nconst two: number = 2\nconst untouched: number = 3'
  await FileSystem.writeFile(`${tmpDir}/file1.ts`, originalText)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.ts`)
  await Editor.setSelections(new Uint32Array([0, 6, 1, 6]))

  const control = 1 << 11
  const keySlash = 88
  await Command.execute('KeyBindings.handleKeyBinding', control | keySlash)
  await Editor.shouldHaveText('// const one: number = 1\n// const two: number = 2\nconst untouched: number = 3')

  await Command.execute('KeyBindings.handleKeyBinding', control | keySlash)
  await Editor.shouldHaveText(originalText)
}
