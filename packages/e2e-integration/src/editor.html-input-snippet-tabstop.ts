import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.html-input-snippet-tabstop'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/index.html`
  await FileSystem.writeFile(uri, '')
  await Workspace.setUri(tmpDir)
  await Main.openUri(uri)

  await Editor.type('input')
  await Editor.handleTab()
  await Editor.shouldHaveText('<input type="">')
  await Editor.shouldHaveSelections(new Uint32Array([0, 13, 0, 13]))

  await Editor.type('text')
  await Editor.handleTab()
  await Editor.shouldHaveText('<input type="text">')
  await Editor.shouldHaveSelections(new Uint32Array([0, 19, 0, 19]))
}
