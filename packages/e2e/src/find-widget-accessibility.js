// manual accessibility tests

// open find widget
// nvda says:  ""
// windows narrator says:  ""
// orca says: "leaving main content, find entry line, 1 of 100 found for line"

// focus next item
// nvda says:  ""
// windows narrator says:  ""
// orca says:  "2 of 100 found for line"

// no results
// nvda says:  ""
// windows narrator says:  ""
// orca says:  ""

// button: focus previous
// nvda says:  ""
// windows narrator says:  ""
// orca says:  "previous match, push button"

// button: focus next
// nvda says:  ""
// windows narrator says:  ""
// orca says:  "next match, push button"

// button: close
// nvda says:  ""
// windows narrator says:  ""
// orca says:  "close, push button"

export const name = 'viewlet.editor-find-widget-accessibility'

export const skip = true

export const test = async ({ FileSystem, Workspace, Main, Editor, Locator, expect, FindWidget }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `content 1
content 2`
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)

  // act
  await Editor.setSelections(new Uint32Array([0, 0, 0, 7]))
  await Editor.openFindWidget()

  // assert
  const findWidgetInput = Locator('.FindWidget .MultilineInputBox')
  await expect(findWidgetInput).toBeVisible()
  await expect(findWidgetInput).toBeFocused()
  await expect(findWidgetInput).toHaveAttribute('placeholder', 'Find')
  const findWidgetButtonFocusPrevious = Locator('.FindWidget [title="Previous Match"]')
  await expect(findWidgetButtonFocusPrevious).toHaveAttribute('title', 'Previous Match')
}
