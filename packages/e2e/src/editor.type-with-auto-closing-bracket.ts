import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-type-with-auto-closing-bracket'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Settings, Workspace }) => {
  const autoClosingBrackets = await Command.execute('Preferences.get', 'editor.autoClosingBrackets')
  try {
    await Settings.update({ 'editor.autoClosingBrackets': true })
    const tmpDir = await FileSystem.getTmpDir()
    await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'hello world')
    await Workspace.setPath(tmpDir)
    await Main.openUri(`${tmpDir}/file1.txt`)

    await Editor.setSelections(new Uint32Array([0, 6, 0, 11]))
    await Command.execute('Editor.handleBeforeInput', 'insertText', '(')

    await Editor.shouldHaveText('hello (world)')
    await Editor.shouldHaveSelections(new Uint32Array([0, 7, 0, 12]))

    await Editor.setSelections(new Uint32Array([0, 12, 0, 7]))
    await Command.execute('Editor.handleBeforeInput', 'insertText', '[')

    await Editor.shouldHaveText('hello ([world])')
    await Editor.shouldHaveSelections(new Uint32Array([0, 13, 0, 8]))

    await Command.execute('Editor.undo')
    await Editor.shouldHaveText('hello (world)')
    await Editor.shouldHaveSelections(new Uint32Array([0, 12, 0, 7]))

    await Command.execute('Editor.redo')
    await Editor.shouldHaveText('hello ([world])')
    await Editor.shouldHaveSelections(new Uint32Array([0, 13, 0, 8]))
  } finally {
    await Settings.update({ 'editor.autoClosingBrackets': autoClosingBrackets })
  }
}
