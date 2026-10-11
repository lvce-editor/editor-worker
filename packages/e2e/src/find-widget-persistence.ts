import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-persistence'

// The reload acceptance scenario needs the find-widget and editor-worker releases to be integrated by the app.
export const skip = 1

export const test: Test = async ({ Command, Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `content 1
content 2
content 3`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()

  // act - set a search value
  await FindWidget.setValue('content')

  const findWidgetInput = Locator('.FindWidget .MultilineInputBox')
  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)

  // assert - initial state
  await expect(findWidgetInput).toBeVisible()
  await expect(findWidgetInput).toHaveValue('content')
  await expect(findWidgetMatchCount).toHaveText('1 of 3')

  const findWidget = Locator('.FindWidget')
  // act - reload the application
  await Command.execute('Window.reload')

  // assert - search state is restored after application reload
  await expect(findWidgetInput).toBeVisible()
  await expect(findWidgetInput).toHaveValue('content')
  await expect(findWidgetMatchCount).toHaveText('1 of 3')

  // act - clear the query and reload again
  await FindWidget.setValue('')
  await Command.execute('Window.reload')

  // assert - an intentionally empty query stays empty instead of selecting editor text
  await expect(findWidget).toBeVisible()
  await expect(findWidgetInput).toHaveValue('')

  // act - close the find widget and reload once more
  await FindWidget.close()
  await Command.execute('Window.reload')

  // assert - a closed find widget stays closed
  await expect(findWidget).toBeHidden()
}
