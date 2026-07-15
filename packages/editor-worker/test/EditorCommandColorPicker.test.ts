import { expect, jest, test } from '@jest/globals'
import { WhenExpression, WidgetId } from '@lvce-editor/constants'

jest.unstable_mockModule('../src/parts/AddWidgetToEditor/AddWidgetToEditor.ts', () => ({
  addWidgetToEditor: jest.fn(),
}))

const AddWidgetToEditor = await import('../src/parts/AddWidgetToEditor/AddWidgetToEditor.ts')
const EditorCommandColorPicker = await import('../src/parts/EditorCommand/EditorCommandColorPicker.ts')
const ColorPickerWidgetFactory = await import('../src/parts/ColorPickerWidgetFactory/ColorPickerWidgetFactory.ts')
const FocusKey = await import('../src/parts/FocusKey/FocusKey.ts')

test('openColorPicker gives the color picker full focus', async () => {
  const editor = { uid: 1, widgets: [] }
  await EditorCommandColorPicker.openColorPicker(editor)
  expect(AddWidgetToEditor.addWidgetToEditor).toHaveBeenCalledWith(
    WidgetId.ColorPicker,
    FocusKey.ColorPicker,
    editor,
    ColorPickerWidgetFactory.create,
    expect.any(Function),
    true,
  )
})

test('closeColorPicker restores editor focus', () => {
  const colorPicker = { id: WidgetId.ColorPicker }
  const otherWidget = { id: 999 }
  const editor = {
    additionalFocus: FocusKey.ColorPicker,
    focus: FocusKey.ColorPicker,
    focused: false,
    widgets: [otherWidget, colorPicker],
  }
  expect(EditorCommandColorPicker.closeColorPicker(editor)).toEqual({
    additionalFocus: 0,
    focus: WhenExpression.FocusEditorText,
    focused: true,
    widgets: [otherWidget],
  })
})

test('closeColorPicker does nothing when the color picker is closed', () => {
  const editor = { widgets: [] }
  expect(EditorCommandColorPicker.closeColorPicker(editor)).toBe(editor)
})
