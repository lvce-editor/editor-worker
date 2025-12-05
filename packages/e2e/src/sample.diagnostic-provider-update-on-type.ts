import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.diagnostic-provider-update-on-type'

export const skip = 1

export const test: Test = async ({ Editor, Extension, FileSystem, Main, Settings, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, `abc`)
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())
  await Settings.update({ 'editor.diagnostics': true })
  await Main.openUri(`${tmpDir}/test.xyz`)
  await Editor.setCursor(0, 3)

  // act
  await Editor.type('def')

  // assert
  // @ts-ignore
  await Editor.shouldHaveDiagnostics([
    {
      columnIndex: 1,
      endColumnIndex: 7,
      endRowIndex: 1,
      message: 'error',
      rowIndex: 1,
      type: 'error', // TODO use numeric diagnostic type
    },
  ])
}
