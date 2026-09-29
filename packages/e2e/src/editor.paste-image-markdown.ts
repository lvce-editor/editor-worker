import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-paste-image-markdown'

// This app-facing regression is enabled after the renderer-process and editor-worker releases are integrated.
export const skip = 1

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const markdownUri = `${tmpDir}/notes.md`
  const imageUri = `${tmpDir}/image.png`
  await FileSystem.writeFile(markdownUri, '')
  await Workspace.setPath(tmpDir)
  await Main.openUri(markdownUri)
  await Command.execute('ClipBoard.writeImage', new Blob([Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0])], { type: 'image/png' }))

  await Command.execute('Editor.paste')

  await Editor.shouldHaveText('![image](image.png)')
  await FileSystem.readFile(imageUri)
  await Editor.undo()
  await Editor.shouldHaveText('')
  await Editor.redo()
  await Editor.shouldHaveText('![image](image.png)')
}
