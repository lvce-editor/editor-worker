import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'color-picker-close-escape'

// Enable after the color-picker-worker focus command is released.
export const skip = 1

export const test: Test = async ({ Editor, expect, FileSystem, KeyBoard, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'abc')
  await Main.openUri(`${tmpDir}/file.txt`)

  // act
  await Editor.openColorPicker()

  // assert - the picker receives focus when opened
  const colorPicker = Locator('.ColorPicker')
  await expect(colorPicker).toBeVisible()
  const colorPickerSlider = Locator('.ColorPickerSliderWrapper')
  await expect(colorPickerSlider).toBeFocused()

  // act - close the picker with Escape
  await KeyBoard.press('Escape')

  // assert - the picker closes and editor input regains focus
  await expect(colorPicker).toBeHidden()
  const editorInput = Locator('.EditorInput textarea')
  await expect(editorInput).toBeFocused()
}
