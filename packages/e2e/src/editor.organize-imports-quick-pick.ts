import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.organize-imports-quick-pick'

export const test: Test = async ({ Command, Editor, Extension, FileSystem, Main, QuickPick, Workspace }) => {
  const extensionUri = import.meta.resolve('../fixtures/editor.source-actions-execute')
  await Extension.addWebExtension(extensionUri)
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/test.xyz`
  const originalText = `import { add, subtract } from './add.xyz'`
  await FileSystem.writeFile(file, originalText)
  await Workspace.setPath(tmpDir)
  await Main.openUri(file)

  await QuickPick.open()
  await QuickPick.selectItem('Editor: Organize Imports')

  await Editor.shouldHaveText(`import { add } from './add.xyz'`)
  await Command.execute('Editor.undo')
  await Editor.shouldHaveText(originalText)
}
