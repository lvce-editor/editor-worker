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

jest.unstable_mockModule('../src/parts/GetColorPickerRange/GetColorPickerRange.ts', () => ({
  getColorPickerRange: jest.fn(() => ({ endOffset: 20, startOffset: 10, value: '#000' })),
}))

jest.unstable_mockModule('../src/parts/GetDocumentEdits/GetDocumentEdits.ts', () => ({
  getDocumentEdits: jest.fn(() => [
    {
      deleted: ['#000'],
      end: { columnIndex: 14, rowIndex: 0 },
      inserted: ['#ff0000'],
      origin: 'format',
      start: { columnIndex: 10, rowIndex: 0 },
    },
  ]),
}))

jest.unstable_mockModule('../src/parts/Editor/Editor.ts', () => ({
  scheduleDocumentAndCursorsSelections: jest.fn(async (editor: any, edits: any) => ({
    ...editor,
    undoStack: [...editor.undoStack, edits],
  })),
}))

const AddWidgetToEditor = await import('../src/parts/AddWidgetToEditor/AddWidgetToEditor.ts')
const EditorCommandColorPicker = await import('../src/parts/EditorCommand/EditorCommandColorPicker.ts')
const ColorPickerWidgetFactory = await import('../src/parts/ColorPickerWidgetFactory/ColorPickerWidgetFactory.ts')
const FocusKey = await import('../src/parts/FocusKey/FocusKey.ts')
const GetColorPickerBounds = await import('../src/parts/GetColorPickerBounds/GetColorPickerBounds.ts')
const GetColorPickerRange = await import('../src/parts/GetColorPickerRange/GetColorPickerRange.ts')

beforeEach(() => {
  WidgetRevision.reset()
})

test('openColorPicker gives the color picker full focus and captures the edited range', async () => {
  const editor = { uid: 1, undoStack: [], widgets: [] }
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
  expect(GetColorPickerRange.getColorPickerRange).toHaveBeenCalledWith(editor)
  const createWidget = (AddWidgetToEditor.addWidgetToEditor as jest.Mock).mock.calls[0][3] as () => unknown
  createWidget()
  expect(ColorPickerWidgetFactory.create).toHaveBeenCalledWith(
    { height: 200, width: 300, x: 10, y: 20 },
    { endOffset: 20, startOffset: 10, value: '#000' },
    0,
  )
})

test('updateColorPickerValue replaces the captured range and advances its end offset', async () => {
  const colorPicker = {
    id: WidgetId.ColorPicker,
    newState: { endOffset: 14, startOffset: 10, undoStackIndex: 0 },
    oldState: { endOffset: 14, startOffset: 10, undoStackIndex: 0 },
  }
  const editor = { undoStack: [], widgets: [colorPicker] }
  const result = await EditorCommandColorPicker.updateColorPickerValue(editor, '#ff0000')
  expect(result.undoStack[0][0]).toMatchObject({ inserted: ['#ff0000'], origin: 'colorPicker' })
  expect(result.widgets[0].newState.endOffset).toBe(17)
  expect(result.widgets[0].oldState.endOffset).toBe(17)
})

test('updateColorPickerValue does nothing without a color picker', async () => {
  const editor = { widgets: [] }
  await expect(EditorCommandColorPicker.updateColorPickerValue(editor, '#ff0000')).resolves.toBe(editor)
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
