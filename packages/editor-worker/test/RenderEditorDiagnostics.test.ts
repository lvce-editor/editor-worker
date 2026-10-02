import { expect, test } from '@jest/globals'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { emptyIncrementalEdits } from '../src/parts/EmptyIncrementalEdits/EmptyIncrementalEdits.ts'
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
