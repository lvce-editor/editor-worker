import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.diagnostic-provider-update-on-type'

export const skip = 1

export const test: Test = async ({ Editor, Settings, Main, FileSystem, Workspace, Extension }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, `abc`)
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())
  await Settings.update({ 'editor.diagnostics': true })
  await Main.openUri(`${tmpDir}/test.xyz`)

  // act
  await Editor.type('def')

  // assert
  // @ts-ignore
  // await Editor.shouldHaveDiagnostics([
  //   {
  //     rowIndex: 1,
  //     columnIndex: 1,
  //     endRowIndex: 1,
  //     endColumnIndex: 7,
  //     type: 'error', // TODO use numeric diagnostic type
  //     message: 'error',
  //     // TODO maybe add error code property
  //     // TODO maybe add error source property
  //   },
  // ])
}
