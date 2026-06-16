import type { Test } from '@lvce-editor/test-with-playwright'

const pastedText = Array.from({ length: 50 }, (_, index) => `line ${index + 1}`).join('\n')

export const name = 'viewlet.editor-paste-text-large-multiline'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'start\nend')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 5)

  await Command.execute('Editor.pasteText', `\n${pastedText}`)

  await Editor.shouldHaveText(`start\n${pastedText}\nend`)
}
