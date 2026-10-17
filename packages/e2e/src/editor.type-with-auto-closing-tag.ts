import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.type-with-auto-closing-tag'

export const test: Test = async ({ Command, Editor, Extension, FileSystem, Main, Workspace }) => {
  await Extension.addWebExtension(import.meta.resolve('../fixtures/editor.auto-closing-tag/dist'))
  const tmpDir = await FileSystem.getTmpDir()
  const htmlPath = `${tmpDir}/index.html`
  await FileSystem.writeFile(htmlPath, '<div><span><')
  await Workspace.setPath(tmpDir)
  await Main.openUri(htmlPath)

  await Editor.setSelections(new Uint32Array([0, 12, 0, 12]))
  await Command.execute('Editor.handleBeforeInput', 'insertText', '/')

  await Editor.shouldHaveText('<div><span></span>')
  await Editor.shouldHaveSelections(new Uint32Array([0, 18, 0, 18]))

  await Command.execute('Editor.undo')
  await Editor.shouldHaveText('<div><span><')
  await Editor.shouldHaveSelections(new Uint32Array([0, 12, 0, 12]))

  await Command.execute('Editor.redo')
  await Editor.shouldHaveText('<div><span></span>')
  await Editor.shouldHaveSelections(new Uint32Array([0, 18, 0, 18]))

  const voidElementPath = `${tmpDir}/void.html`
  await FileSystem.writeFile(voidElementPath, '<div><br><')
  await Main.openUri(voidElementPath)
  await Editor.setSelections(new Uint32Array([0, 10, 0, 10]))
  await Command.execute('Editor.handleBeforeInput', 'insertText', '/')
  await Editor.shouldHaveText('<div><br></div>')
  await Editor.shouldHaveSelections(new Uint32Array([0, 15, 0, 15]))

  const unmatchedPath = `${tmpDir}/unmatched.html`
  await FileSystem.writeFile(unmatchedPath, '<')
  await Main.openUri(unmatchedPath)
  await Editor.setSelections(new Uint32Array([0, 1, 0, 1]))
  await Command.execute('Editor.handleBeforeInput', 'insertText', '/')
  await Editor.shouldHaveText('</')
  await Editor.shouldHaveSelections(new Uint32Array([0, 2, 0, 2]))

  const plainSlashPath = `${tmpDir}/plain.html`
  await FileSystem.writeFile(plainSlashPath, '<div>')
  await Main.openUri(plainSlashPath)
  await Editor.setSelections(new Uint32Array([0, 5, 0, 5]))
  await Command.execute('Editor.handleBeforeInput', 'insertText', '/')
  await Editor.shouldHaveText('<div>/')
  await Command.execute('Editor.undo')
  await Editor.shouldHaveText('<div>')
  await Command.execute('Editor.redo')
  await Editor.shouldHaveText('<div>/')
}
