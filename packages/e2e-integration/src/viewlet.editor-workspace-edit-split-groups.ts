import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-workspace-edit-split-groups'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const importerUri = `${tmpDir}/aboutWorkerMain.ts`
  const exporterUri = `${tmpDir}/Main.ts`
  const importerText = "import * as Main from './Main.ts'\n\nMain.main()\n"
  const exporterText = 'export const main = () => 1\n'
  await FileSystem.writeFile(importerUri, importerText)
  await FileSystem.writeFile(exporterUri, exporterText)
  await Workspace.setUri(tmpDir)
  await Main.openUri(importerUri)
  await Command.execute('Main.splitRight')
  await Main.openUri(exporterUri)

  // act
  await Command.execute('Editor.applyWorkspaceEdit', [
    {
      edits: [
        {
          deleted: 4,
          inserted: 'gain',
          offset: importerText.lastIndexOf('main'),
        },
      ],
      uri: importerUri,
    },
    {
      edits: [
        {
          deleted: 4,
          inserted: 'gain',
          offset: exporterText.indexOf('main'),
        },
      ],
      uri: exporterUri,
    },
  ])

  // assert
  await expect(Locator('.EditorGroup').nth(0)).toContainText('Main.gain()')
  await expect(Locator('.EditorGroup').nth(1)).toContainText('export const gain = () => 1')
}
