import { beforeEach, expect, jest, test } from '@jest/globals'
import { WhenExpression, WidgetId } from '@lvce-editor/constants'
import * as WidgetRevision from '../src/parts/WidgetRevision/WidgetRevision.ts'

jest.unstable_mockModule('../src/parts/AddWidgetToEditor/AddWidgetToEditor.ts', () => ({
  addWidgetToEditor: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/ColorPickerWidgetFactory/ColorPickerWidgetFactory.ts', () => ({
  create: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/GetColorPickerBounds/GetColorPickerBounds.ts', () => ({
  getColorPickerBounds: jest.fn(() => ({ height: 200, width: 300, x: 10, y: 20 })),
}))

const AddWidgetToEditor = await import('../src/parts/AddWidgetToEditor/AddWidgetToEditor.ts')
const EditorCommandColorPicker = await import('../src/parts/EditorCommand/EditorCommandColorPicker.ts')
const ColorPickerWidgetFactory = await import('../src/parts/ColorPickerWidgetFactory/ColorPickerWidgetFactory.ts')
const FocusKey = await import('../src/parts/FocusKey/FocusKey.ts')
const GetColorPickerBounds = await import('../src/parts/GetColorPickerBounds/GetColorPickerBounds.ts')

beforeEach(() => {
  WidgetRevision.reset()
})

test('openColorPicker gives the color picker full focus', async () => {
  const editor = { uid: 1, widgets: [] }
  await EditorCommandColorPicker.openColorPicker(editor)
  expect(AddWidgetToEditor.addWidgetToEditor).toHaveBeenCalledWith(
    WidgetId.ColorPicker,
    FocusKey.ColorPicker,
    editor,
    expect.any(Function),
    expect.any(Function),
    true,
  )
  expect(GetColorPickerBounds.getColorPickerBounds).toHaveBeenCalledWith(editor)
  const createWidget = (AddWidgetToEditor.addWidgetToEditor as jest.Mock).mock.calls[0][3] as () => unknown
  createWidget()
  expect(ColorPickerWidgetFactory.create).toHaveBeenCalledWith({ height: 200, width: 300, x: 10, y: 20 })
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
    widgetRevision: 1,
    widgets: [otherWidget],
  })
})

test('closeColorPicker does nothing when the color picker is closed', () => {
  const editor = { widgets: [] }
  expect(EditorCommandColorPicker.closeColorPicker(editor)).toBe(editor)
})
