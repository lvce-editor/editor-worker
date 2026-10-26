import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.insert-line-break-c-indent'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  await Command.execute('ExtensionMeta.addWebExtension', import.meta.resolve('../fixtures/editor.insert-line-break-c-indent'))
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/paired.c`, 'int main(){}')
  await FileSystem.writeFile(`${tmpDir}/nested.c`, 'int main(){\n  if (true){}\n}')
  await FileSystem.writeFile(`${tmpDir}/open.c`, 'int main(){')
  await FileSystem.writeFile(`${tmpDir}/ordinary.c`, 'int main()')
  await Workspace.setPath(tmpDir)

  await Main.openUri(`${tmpDir}/paired.c`)
  await Editor.setCursor(0, 11)
  await Editor.insertLineBreak()
  await Editor.shouldHaveText('int main(){\n  \n}')
  await Editor.shouldHaveSelections(new Uint32Array([1, 2, 1, 2]))

  await Main.openUri(`${tmpDir}/nested.c`)
  await Editor.setCursor(1, 12)
  await Editor.insertLineBreak()
  await Editor.shouldHaveText('int main(){\n  if (true){\n    \n  }\n}')
  await Editor.shouldHaveSelections(new Uint32Array([2, 4, 2, 4]))

  await Main.openUri(`${tmpDir}/open.c`)
  await Editor.setCursor(0, 11)
  await Editor.insertLineBreak()
  await Editor.shouldHaveText('int main(){\n  ')
  await Editor.shouldHaveSelections(new Uint32Array([1, 2, 1, 2]))

  await Main.openUri(`${tmpDir}/ordinary.c`)
  await Editor.setCursor(0, 10)
  await Editor.insertLineBreak()
  await Editor.shouldHaveText('int main()\n')
  await Editor.shouldHaveSelections(new Uint32Array([1, 0, 1, 0]))
}
