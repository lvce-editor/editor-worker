import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.diagnostic-provider'

export const skip = 1

export const test: Test = async ({ Editor, Settings, Main, FileSystem, Workspace, Extension }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, `abcdefgh`)
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())
  await Settings.update({ 'editor.diagnostics': true })

  // act
  await Main.openUri(`${tmpDir}/test.xyz`)

  // assert
  // @ts-ignore
  await Editor.shouldHaveDiagnostics([
    {
      rowIndex: 1,
      columnIndex: 1,
      endRowIndex: 1,
      endColumnIndex: 4,
      type: 'error',
      message: 'error',
    },
  ])
}
