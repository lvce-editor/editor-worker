import { expect, test } from '@jest/globals'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import * as RenderEditor from '../src/parts/RenderEditor/RenderEditor.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

const breakPoints: readonly number[] = []
const cursorInfos: readonly any[] = []
const gutterDecorations: readonly any[] = []
const selectionInfos: readonly any[] = []
const visibleLineIndices = [0, 1]
const widgets: readonly any[] = []

const createState = (uid: number, selections: Uint32Array) => ({
  additionalFocus: 0,
  breakPoints,
  cursorInfos,
  focus: 12,
  focused: true,
  gutterDecorations,
  highlightActiveLineNumber: true,
  lightBulbRowIndex: -1,
  lineNumbers: true,
  maxLineY: 2,
  minLineY: 0,
  primarySelectionIndex: 0,
  selectionInfos,
  selections,
  uid,
  visibleLineIndices,
  widgetRevision: 0,
  widgets,
})

test('renderEditor moves the active line number with the primary cursor', async () => {
  const uid = 910_003
  const oldState = createState(uid, new Uint32Array([0, 0, 0, 0]))
  const newState = createState(uid, new Uint32Array([1, 0, 1, 0]))
  EditorStates.set(uid, oldState as any, newState as any)

  try {
    await expect(RenderEditor.renderEditor(uid)).resolves.toEqual([
      [
        'renderGutter',
        [
          {
            childCount: 1,
            className: 'LineNumber',
            type: VirtualDomElements.Span,
          },
          {
            childCount: 0,
            text: 1,
            type: VirtualDomElements.Text,
          },
          {
            childCount: 1,
            className: 'LineNumber LineNumberActive',
            type: VirtualDomElements.Span,
          },
          {
            childCount: 0,
            text: 2,
            type: VirtualDomElements.Text,
          },
        ],
      ],
    ])
  } finally {
    EditorStates.dispose(uid)
  }
})

test('renderEditor does not rerender the gutter for horizontal cursor movement', async () => {
  const uid = 910_004
  const oldState = createState(uid, new Uint32Array([0, 0, 0, 0]))
  const newState = createState(uid, new Uint32Array([0, 1, 0, 1]))
  EditorStates.set(uid, oldState as any, newState as any)

  try {
    await expect(RenderEditor.renderEditor(uid)).resolves.toEqual([])
  } finally {
    EditorStates.dispose(uid)
  }
})

test('renderEditor removes the active line number highlight when disabled', async () => {
  const uid = 910_006
  const oldState = createState(uid, new Uint32Array([1, 0, 1, 0]))
  const newState = {
    ...oldState,
    highlightActiveLineNumber: false,
  }
  EditorStates.set(uid, oldState as any, newState as any)

  try {
    const commands = await RenderEditor.renderEditor(uid)
    expect(commands).toHaveLength(1)
    expect(commands[0]).toEqual(['renderGutter', expect.not.arrayContaining([expect.objectContaining({ className: 'LineNumber LineNumberActive' })])])
  } finally {
    EditorStates.dispose(uid)
  }
})

test('renderEditor does not rerender the gutter for vertical cursor movement when highlighting is disabled', async () => {
  const uid = 910_007
  const oldState = {
    ...createState(uid, new Uint32Array([0, 0, 0, 0])),
    highlightActiveLineNumber: false,
  }
  const newState = {
    ...oldState,
    selections: new Uint32Array([1, 0, 1, 0]),
  }
  EditorStates.set(uid, oldState as any, newState as any)

  try {
    await expect(RenderEditor.renderEditor(uid)).resolves.toEqual([])
  } finally {
    EditorStates.dispose(uid)
  }
})

test('renderEditor rerenders the gutter when gutter decorations change', async () => {
  const uid = 910_005
  const oldState = createState(uid, new Uint32Array([0, 0, 0, 0]))
  const newState = {
    ...oldState,
    gutterDecorations: [{ rowIndex: 1, type: 'modified' as const }],
  }
  EditorStates.set(uid, oldState as any, newState as any)

  try {
    const commands = await RenderEditor.renderEditor(uid)
    expect(commands).toHaveLength(1)
    expect(commands[0]).toEqual([
      'renderGutter',
      expect.arrayContaining([
        expect.objectContaining({
          className: 'EditorGutterDecoration EditorGutterDecorationModified',
          title: 'Modified line 2',
        }),
      ]),
    ])
  } finally {
    EditorStates.dispose(uid)
  }
})
