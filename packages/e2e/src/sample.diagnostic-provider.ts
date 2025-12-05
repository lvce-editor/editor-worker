import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.diagnostic-provider'

export const skip = 1

export const test: Test = async ({ Editor, Extension, FileSystem, Main, Settings, Workspace }) => {
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
      columnIndex: 1,
      endColumnIndex: 4,
      endRowIndex: 1,
      message: 'error',
      rowIndex: 1,
      type: 'error', // TODO use numeric diagnostic type
      // TODO maybe add error code property
      // TODO maybe add error source property
    },
  ])
}
