import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-toggle-comment-html'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const originalText = `<script type="module">
  const value = 1
  console.log(value)
</script>
<style>
  body { color: red }
</style>
<div>content</div>`
  await FileSystem.writeFile(`${tmpDir}/file.html`, originalText)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file.html`)

  await Editor.setSelections(new Uint32Array([1, 2, 2, 4]))
  await Command.execute('Editor.toggleComment')
  await Editor.shouldHaveText(`<script type="module">
  // const value = 1
  // console.log(value)
</script>
<style>
  body { color: red }
</style>
<div>content</div>`)
  await Editor.undo()
  await Editor.shouldHaveText(originalText)
  await Editor.redo()
  await Editor.shouldHaveText(`<script type="module">
  // const value = 1
  // console.log(value)
</script>
<style>
  body { color: red }
</style>
<div>content</div>`)
  await Command.execute('Editor.toggleComment')
  await Editor.shouldHaveText(originalText)

  await Editor.setCursor(5, 5)
  await Command.execute('Editor.toggleComment')
  await Editor.shouldHaveText(`<script type="module">
  const value = 1
  console.log(value)
</script>
<style>
  /*body { color: red }*/
</style>
<div>content</div>`)
  await Command.execute('Editor.toggleComment')
  await Editor.shouldHaveText(originalText)

  await Editor.setCursor(7, 5)
  await Command.execute('Editor.toggleComment')
  await Editor.shouldHaveText(`<script type="module">
  const value = 1
  console.log(value)
</script>
<style>
  body { color: red }
</style>
<!-- <div>content</div> -->`)
  await Command.execute('Editor.toggleComment')
  await Editor.shouldHaveText(originalText)
}
