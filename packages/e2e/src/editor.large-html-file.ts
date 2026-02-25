import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.large-html-file'

const createLargeHtmlDocument = (): string => {
  const totalLines = 2_000_000
  const header = `<!doctype html>\n<meta charset="utf8">\n<body>\n`
  const block = `  <p>These lines are repeated many times to save memory on\n  string data.</p>\n  <hr>\n  <img src="../../style/logo.svg">\n\n`
  const footer = '</body>'

  const headerLines = 3
  const footerLines = 1
  const blockLines = 5
  const repeatCount = (totalLines - headerLines - footerLines) / blockLines

  return `${header}${block.repeat(repeatCount)}${footer}`
}

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const htmlPath = `${tmpDir}/large.html`
  const htmlContent = createLargeHtmlDocument()

  await FileSystem.writeFile(htmlPath, htmlContent)
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(htmlPath)

  // assert
  await Editor.shouldHaveText(htmlContent)
}
