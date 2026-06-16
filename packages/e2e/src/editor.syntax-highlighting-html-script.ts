import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.syntax-highlighting-html-script'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const htmlPath = `${tmpDir}/script.html`
  const htmlContent = `<!doctype html>
<html>
  <body>
    <script>
      const answer = 42
    </script>
  </body>
</html>`

  await FileSystem.writeFile(htmlPath, htmlContent)
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(htmlPath)

  // assert
  const keywordToken = Locator('.Token.Keyword')
  await expect(keywordToken).toHaveCount(1)
  await expect(keywordToken.first()).toContainText('const')
}
