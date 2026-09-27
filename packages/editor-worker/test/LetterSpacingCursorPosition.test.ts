import { expect, test } from '@jest/globals'
import { TextMeasurementWorker } from '@lvce-editor/rpc-registry'
import * as EditorCommandHandleMouseDown from '../src/parts/EditorCommand/EditorCommandHandleMouseDown.ts'
import * as MeasureCharacterWidth from '../src/parts/MeasureCharacterWidth/MeasureCharacterWidth.ts'

test('clicking uses the configured editor letter spacing', async () => {
  using _mockRpc = TextMeasurementWorker.registerMockRpc({
    'TextMeasurement.measureTextWidth'(text: string, _fontWeight: number, _fontSize: number, _fontFamily: string, letterSpacing: number) {
      return text.length * 8 + Math.max(0, text.length - 1) * letterSpacing
    },
  })
  const letterSpacing = 1.5
  const charWidth = await MeasureCharacterWidth.measureCharacterWidth(400, 14, 'Fira Code', letterSpacing)
  const editor = {
    charWidth,
    columnWidth: charWidth,
    cursorWidth: 2,
    deltaX: 0,
    deltaY: 0,
    dragAndDropEnabled: true,
    fontFamily: 'Fira Code',
    fontSize: 14,
    fontWeight: 400,
    halfCursorWidth: 1,
    height: 200,
    hoverEnabled: false,
    isMonospaceFont: true,
    isSelecting: false,
    letterSpacing,
    lineCache: [],
    lineHeight: 20,
    lines: ['hello world'],
    maxLineY: 10,
    minLineY: 0,
    primarySelectionIndex: 0,
    rowHeight: 20,
    rowHeightIncludingMargin: 20,
    selections: new Uint32Array([0, 0, 0, 0]),
    tabSize: 2,
    textDragDropPosition: { columnIndex: 0, rowIndex: 0 },
    textDragId: 0,
    uri: 'file:///workspace/file.txt',
    widgets: [],
    width: 400,
    x: 0,
    y: 0,
  }

  const result = await EditorCommandHandleMouseDown.handleMouseDown(editor as any, 0, false, false, 47, 0, 1)

  expect(result.selections).toEqual(new Uint32Array([0, 5, 0, 5]))
})
