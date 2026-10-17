import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-type-with-auto-closing-bracket-multiple-selections'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Settings, Workspace }) => {
  const autoClosingBrackets = await Command.execute('Preferences.get', 'editor.autoClosingBrackets')
  try {
    await Settings.update({ 'editor.autoClosingBrackets': true })
    const tmpDir = await FileSystem.getTmpDir()
    await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'alpha\ngamma\ndelta')
    await Workspace.setPath(tmpDir)
    await Main.openUri(`${tmpDir}/file1.txt`)
    await Editor.setSelections(new Uint32Array([0, 0, 0, 5, 1, 2, 1, 2, 2, 5, 2, 0]))

    await Command.execute('Editor.handleBeforeInput', 'insertText', '{')

    await Editor.shouldHaveText('{alpha}\nga{}mma\n{delta}')
    await Editor.shouldHaveSelections(new Uint32Array([0, 1, 0, 6, 1, 3, 1, 3, 2, 6, 2, 1]))
  } finally {
    await Settings.update({ 'editor.autoClosingBrackets': autoClosingBrackets })
  }
}
