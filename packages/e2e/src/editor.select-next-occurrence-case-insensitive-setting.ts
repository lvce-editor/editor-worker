import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-select-next-occurrence-case-insensitive-setting'

export const test: Test = async ({ Command, Editor, expect, FileSystem, KeyBoard, Locator, Main, Settings, Workspace }) => {
  try {
    const tmpDir = await FileSystem.getTmpDir()
    const uri = `${tmpDir}/file1.txt`
    await FileSystem.writeFile(uri, 'foo FOO foo')
    await Workspace.setPath(tmpDir)
    await Main.openUri(uri)
    await Editor.setSelections(new Uint32Array([0, 0, 0, 3]))

    await Settings.update({ 'editor.selectedTextOccurrenceMatching': 'caseInsensitive' })
    await Command.execute('Editor.handleSettingsChanged')
    await KeyBoard.press('Control+d')
    const renderedSelections = Locator('.EditorSelection')
    await expect(renderedSelections).toHaveCount(2)

    await Editor.shouldHaveSelections(new Uint32Array([0, 0, 0, 3, 0, 4, 0, 7]))
  } finally {
    await Settings.update({ 'editor.selectedTextOccurrenceMatching': 'caseSensitive' })
    await Command.execute('Editor.handleSettingsChanged')
  }
}
