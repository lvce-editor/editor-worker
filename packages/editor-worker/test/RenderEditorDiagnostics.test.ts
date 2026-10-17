import { expect, test } from '@jest/globals'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { emptyIncrementalEdits } from '../src/parts/EmptyIncrementalEdits/EmptyIncrementalEdits.ts'
import * as GetEditorRowsVirtualDom from '../src/parts/GetEditorRowsVirtualDom/GetEditorRowsVirtualDom.ts'
import * as RenderEditor from '../src/parts/RenderEditor/RenderEditor.ts'

test('renderEditor rerenders token classes when diagnostics change', async () => {
  const uid = 910_008
  const sharedState = {
    additionalFocus: 0,
    bracketMatchInfos: [],
    breakPoints: [],
    cursorInfos: [],
    decorations: [],
    differences: [0],
    endOfLineDecorations: [],
    foldingRanges: [],
    gutterDecorations: [],
    highlightActiveLineNumber: false,
    highlightedLine: -1,
    incrementalEdits: emptyIncrementalEdits,
    lineNumbers: false,
    maxLineY: 1,
    minLineY: 0,
    primarySelectionIndex: 0,
    problemsHighlightedRow: -1,
    selectionInfos: [],
    selections: new Uint32Array(),
    textInfos: [['abcdefgh', 'Token']],
    uid,
    visibleLineIndices: [],
    visibleViewLineIndices: [],
    visualDecorations: [],
    widgetRevision: 0,
    widgets: [],
  }
  const oldState = {
    ...sharedState,
    diagnostics: [],
  }
  const newState = {
    ...sharedState,
    decorations: [],
    diagnostics: [
      {
        columnIndex: 1,
        endColumnIndex: 4,
        endRowIndex: 0,
        rowIndex: 0,
        tags: [1],
      },
    ],
  }
  EditorStates.set(uid, oldState as any, newState as any)

  try {
    await expect(RenderEditor.renderEditor(uid)).resolves.toEqual([
      [
        'setText',
        expect.arrayContaining([expect.objectContaining({ className: 'Token EditorTokenUnnecessary' }), expect.objectContaining({ text: 'bcd' })]),
      ],
    ])
  } finally {
    EditorStates.dispose(uid)
  }
})

test('renderEditor keeps diagnostic columns absolute within horizontally clipped text', async () => {
  const uid = 910_009
  const sharedState = {
    additionalFocus: 0,
    bracketMatchInfos: [],
    breakPoints: [],
    charWidth: 10,
    cursorInfos: [],
    deltaX: 40,
    diagnostics: [
      {
        columnIndex: 5,
        endColumnIndex: 7,
        endRowIndex: 0,
        rowIndex: 0,
        tags: [1],
      },
    ],
    differences: [0],
    endOfLineDecorations: [{ rowIndex: 0, text: 'EOL' }],
    foldingRanges: [],
    gutterDecorations: [],
    highlightActiveLineNumber: false,
    highlightedLine: -1,
    horizontalVirtualizationThreshold: 0,
    incrementalEdits: emptyIncrementalEdits,
    lineNumbers: false,
    lines: ['abcdefghij'],
    maxLineY: 1,
    minLineY: 0,
    primarySelectionIndex: 0,
    problemsHighlightedRow: -1,
    selectionInfos: [],
    selections: new Uint32Array(),
    textInfos: [['efgh', 'Token']],
    uid,
    visibleLineIndices: [],
    visibleViewLineIndices: [],
    visualDecorations: [],
    widgetRevision: 0,
    widgets: [],
    width: 20,
  }
  EditorStates.set(uid, { ...sharedState, diagnostics: [] } as any, sharedState as any)

  try {
    const [command] = await RenderEditor.renderEditor(uid)
    const dom = command[1]
    expect(dom).toEqual(
      expect.arrayContaining([expect.objectContaining({ className: 'Token EditorTokenUnnecessary' }), expect.objectContaining({ text: 'fg' })]),
    )
    expect(dom).not.toEqual(expect.arrayContaining([expect.objectContaining({ text: 'EOL' })]))
  } finally {
    EditorStates.dispose(uid)
  }
})

test('getEditorRowsVirtualDom maps diagnostic columns after expanded tabs', () => {
  const dom = GetEditorRowsVirtualDom.getEditorRowsVirtualDom(
    [['bc', 'Token']],
    [0],
    false,
    -1,
    [0],
    [],
    [],
    -1,
    [
      {
        columnIndex: 2,
        endColumnIndex: 3,
        endRowIndex: 0,
        rowIndex: 0,
        tags: [1],
      },
    ],
    30,
    10,
    10,
    2,
    ['a\tbcdef'],
    0,
  )

  expect(dom).toEqual(
    expect.arrayContaining([expect.objectContaining({ className: 'Token EditorTokenUnnecessary' }), expect.objectContaining({ text: 'b' })]),
  )
})
