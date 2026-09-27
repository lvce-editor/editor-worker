import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-insert-line-break-python-indent'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  await Command.execute('ExtensionMeta.addWebExtension', import.meta.resolve('../fixtures/editor.insert-line-break-python-indent'))
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/bare.pyt`, 'mock_todos=[')
  await FileSystem.writeFile(`${tmpDir}/paired.pyt`, 'mock_todos=[]')
  await FileSystem.writeFile(`${tmpDir}/indented.pyt`, '  mock_todos=[')
  await FileSystem.writeFile(`${tmpDir}/ordinary.pyt`, 'mock_todos = value')
  await FileSystem.writeFile(`${tmpDir}/comment.pyt`, '# [')
  await FileSystem.writeFile(`${tmpDir}/string.pyt`, "value = '['")
  await FileSystem.writeFile(`${tmpDir}/if-header.pyt`, 'if text:')
  await FileSystem.writeFile(`${tmpDir}/nested-if-header.pyt`, '  if text:')
  await FileSystem.writeFile(`${tmpDir}/commented-if-header.pyt`, 'if text: # comment')
  await FileSystem.writeFile(`${tmpDir}/comment-colon.pyt`, '# if text:')
  await FileSystem.writeFile(`${tmpDir}/string-colon.pyt`, 'value = "if text:"')
  await FileSystem.writeFile(`${tmpDir}/ordinary-colon.pyt`, 'value = other: text')
  await Workspace.setPath(tmpDir)

  await Main.openUri(`${tmpDir}/bare.pyt`)
  await Editor.setCursor(0, 12)
  await Editor.insertLineBreak()
  await Editor.shouldHaveText('mock_todos=[\n  ')
  await Editor.shouldHaveSelections(new Uint32Array([1, 2, 1, 2]))

  await Main.openUri(`${tmpDir}/paired.pyt`)
  await Editor.setCursor(0, 12)
  await Editor.insertLineBreak()
  await Editor.shouldHaveText('mock_todos=[\n  \n]')
  await Editor.shouldHaveSelections(new Uint32Array([1, 2, 1, 2]))

  await Main.openUri(`${tmpDir}/indented.pyt`)
  await Editor.setCursor(0, 14)
  await Editor.insertLineBreak()
  await Editor.shouldHaveText('  mock_todos=[\n    ')
  await Editor.shouldHaveSelections(new Uint32Array([1, 4, 1, 4]))

  await Main.openUri(`${tmpDir}/if-header.pyt`)
  await Editor.setCursor(0, 8)
  await Editor.insertLineBreak()
  await Editor.shouldHaveText('if text:\n  ')
  await Editor.shouldHaveSelections(new Uint32Array([1, 2, 1, 2]))

  await Main.openUri(`${tmpDir}/nested-if-header.pyt`)
  await Editor.setCursor(0, 10)
  await Editor.insertLineBreak()
  await Editor.shouldHaveText('  if text:\n    ')
  await Editor.shouldHaveSelections(new Uint32Array([1, 4, 1, 4]))

  await Main.openUri(`${tmpDir}/commented-if-header.pyt`)
  await Editor.setCursor(0, 18)
  await Editor.insertLineBreak()
  await Editor.shouldHaveText('if text: # comment\n  ')
  await Editor.shouldHaveSelections(new Uint32Array([1, 2, 1, 2]))

  const unchangedCases = [
    ['ordinary.pyt', 'mock_todos = value'],
    ['comment.pyt', '# ['],
    ['string.pyt', "value = '['"],
    ['comment-colon.pyt', '# if text:'],
    ['string-colon.pyt', 'value = "if text:"'],
    ['ordinary-colon.pyt', 'value = other: text'],
  ]
  for (const [fileName, original] of unchangedCases) {
    await Main.openUri(`${tmpDir}/${fileName}`)
    await Editor.setCursor(0, original.length)
    await Editor.insertLineBreak()
    await Editor.shouldHaveText(`${original}\n`)
    await Editor.shouldHaveSelections(new Uint32Array([1, 0, 1, 0]))
  }
}
