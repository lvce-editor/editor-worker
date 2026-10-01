import { beforeEach, expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import * as DiffItems from '../src/parts/DiffItems/DiffItems.ts'
import * as RenderedDoms from '../src/parts/RenderedDoms/RenderedDoms.ts'
import * as RenderIncremental from '../src/parts/RenderIncremental/RenderIncremental.ts'
import * as RenderPlainTextAppend from '../src/parts/RenderPlainTextAppend/RenderPlainTextAppend.ts'

const createState = (minLineY: number, textInfos: readonly any[]): any => ({
  differences: textInfos.map(() => 0),
  initial: false,
  minLineY,
  textInfos,
  uid: 1,
})

const createPlainTextState = (line: string, cursorX: number, overrides: any = {}): any => ({
  ...createState(0, [[line, 'Token PlainText']]),
  bracketMatchInfos: [],
  breakPoints: [],
  cursorInfos: [`${cursorX}px 0px`],
  diagnostics: [],
  differences: [0],
  endOfLineDecorations: [],
  focused: true,
  gutterDecorations: [],
  height: 400,
  languageId: 'plaintext',
  lines: [line],
  longestLineWidth: line.length * 9,
  mergeConflicts: [],
  minimumSliderSize: 14,
  scrollBarHeight: 0,
  selectionInfos: [],
  selections: new Uint32Array([0, line.length, 0, line.length]),
  uid: 3,
  visualDecorations: [],
  width: 1000,
  ...overrides,
})

beforeEach(() => {
  RenderedDoms.clear()
})

test('renderIncremental preserves surrounding dom when visible rows jump during fast scroll', () => {
  const oldState = createState(0, [
    [
      ' '.repeat(4),
      'Token Whitespace',
      '"',
      'Token Punctuation',
      'node_modules/@babel/helper-validator-identifier',
      'Token JsonPropertyName',
      '"',
      'Token Punctuation',
      ':',
      'Token Punctuation',
      ' ',
      'Token Whitespace',
      '{',
      'Token Punctuation',
    ],
  ])
  const newState = createState(4, [
    [
      ' '.repeat(4),
      'Token Whitespace',
      '"',
      'Token Punctuation',
      '@cspell/dict-dotnet',
      'Token JsonPropertyName',
      '"',
      'Token Punctuation',
      ':',
      'Token Punctuation',
      ' ',
      'Token Whitespace',
      '"',
      'Token Punctuation',
      '^5.0.13',
      'Token JsonPropertyValueString',
      '"',
      'Token Punctuation',
      ',',
      'Token Punctuation',
    ],
  ])

  const command = RenderIncremental.renderIncremental(oldState, newState)

  expect(command[0]).toBe(ViewletCommand.SetPatches)
  expect(command[1]).toBe(1)
  expect(command[2]).not.toEqual([
    {
      nodes: expect.any(Array),
      type: 6,
    },
  ])
  expect(command[2]).not.toContainEqual(
    expect.objectContaining({
      type: 2,
    }),
  )
  expect(command[2]).not.toContainEqual(
    expect.objectContaining({
      index: 3,
      type: 9,
    }),
  )
})

test('renderIncremental diffs from the last emitted dom when editor state is mutated', () => {
  const textInfos = [
    [
      ' '.repeat(6),
      'Token Whitespace',
      '"',
      'Token Punctuation',
      'lerna',
      'Token JsonPropertyName',
      '"',
      'Token Punctuation',
      ':',
      'Token Punctuation',
      ' ',
      'Token Whitespace',
      '{',
      'Token Punctuation',
    ],
  ]
  const initialState = createState(0, [])
  initialState.initial = true
  const renderedState = createState(0, textInfos)

  RenderIncremental.renderIncremental(initialState, renderedState)
  textInfos[0] = [
    ' '.repeat(6),
    'Token Whitespace',
    '"',
    'Token Punctuation',
    'lerna',
    'Token JsonPropertyName',
    '"',
    'Token Punctuation',
    ':',
    'Token Punctuation',
    ' ',
    'Token Whitespace',
    '"',
    'Token Punctuation',
    '^8.2.4',
    'Token JsonPropertyValueString',
    '"',
    'Token Punctuation',
    ',',
    'Token Punctuation',
  ]
  const newState = createState(0, textInfos)

  const command = RenderIncremental.renderIncremental(renderedState, newState)

  expect(command[0]).toBe(ViewletCommand.SetPatches)
  expect(command[1]).toBe(1)
  expect(command[2]).not.toEqual([])
})

test('renderIncremental renders measured diagnostic decorations', () => {
  const initialState = createState(0, [])
  initialState.initial = true
  const renderedState = {
    ...createState(0, [['x', 'Token Identifier']]),
    diagnostics: [
      {
        columnIndex: 0,
        endColumnIndex: 1,
        endRowIndex: 0,
        message: "Type 'string' is not assignable to type 'number'.",
        rowIndex: 0,
        type: 'error',
      },
    ],
    visualDecorations: [
      {
        height: 20,
        type: 'error',
        width: 9,
        x: 0,
        y: 0,
      },
    ],
  }

  const command = RenderIncremental.renderIncremental(initialState, renderedState)

  expect(command[2]).toContainEqual({
    nodes: expect.arrayContaining([
      expect.objectContaining({
        className: 'Diagnostic DiagnosticError',
        height: 20,
        left: 0,
        top: 0,
        width: 9,
      }),
    ]),
    type: 6,
  })
  expect(command[2]).toContainEqual({
    nodes: expect.arrayContaining([
      expect.objectContaining({
        className: 'ScrollBarDiagnostic ScrollBarDiagnosticError',
        height: 3,
        top: 0,
      }),
    ]),
    type: 6,
  })
})

test('renderIncremental renders one scrollbar marker for each diagnostic without scrollable content', () => {
  const initialState = createState(0, [])
  initialState.initial = true
  const renderedState = {
    ...createState(0, [
      ['one', 'Token Identifier'],
      ['two', 'Token Identifier'],
      ['three', 'Token Identifier'],
    ]),
    diagnostics: [
      { columnIndex: 0, endColumnIndex: 1, rowIndex: 0, type: 'error' },
      { columnIndex: 0, endColumnIndex: 1, rowIndex: 1, type: 'warning' },
      { columnIndex: 0, endColumnIndex: 1, rowIndex: 2, type: 'error' },
    ],
    height: 400,
    lines: ['one', 'two', 'three'],
  }

  const command = RenderIncremental.renderIncremental(initialState, renderedState)
  const diagnosticMarkerPatch = command[2].find((patch: any) => patch.nodes?.some((node: any) => node.className?.startsWith('ScrollBarDiagnostic ')))
  const diagnosticMarkers = diagnosticMarkerPatch.nodes.filter((node: any) => node.className?.startsWith('ScrollBarDiagnostic '))

  expect(diagnosticMarkers).toHaveLength(3)
  expect(diagnosticMarkers).toEqual([
    expect.objectContaining({ className: 'ScrollBarDiagnostic ScrollBarDiagnosticError', top: 0 }),
    expect.objectContaining({ className: 'ScrollBarDiagnostic ScrollBarDiagnosticWarning', top: 133 }),
    expect.objectContaining({ className: 'ScrollBarDiagnostic ScrollBarDiagnosticError', top: 267 }),
  ])
})

test('renderIncremental renders end of line decorations', () => {
  const initialState = createState(0, [])
  initialState.initial = true
  const renderedState = {
    ...createState(0, [['const value = 1', 'Token Identifier']]),
    endOfLineDecorations: [{ rowIndex: 0, text: 'Test User • Initial commit' }],
  }

  const command = RenderIncremental.renderIncremental(initialState, renderedState)

  expect(command[2]).toContainEqual({
    nodes: expect.arrayContaining([
      expect.objectContaining({
        className: 'EditorLineDecoration',
      }),
    ]),
    type: 6,
  })
})

test('renderIncremental removes and restores scrollbar thumbs when their sizes cross zero', () => {
  const hiddenState = {
    ...createState(0, [['x', 'Token Identifier']]),
    height: 100,
    initial: false,
    longestLineWidth: 100,
    minimumSliderSize: 14,
    scrollBarHeight: 0,
    uid: 2,
    width: 100,
  }
  const visibleState = {
    ...hiddenState,
    longestLineWidth: 200,
    scrollBarHeight: 20,
  }

  RenderIncremental.renderIncremental({ ...hiddenState, initial: true }, hiddenState)
  expect(DiffItems.isEqual(hiddenState, visibleState)).toBe(false)

  const addThumbs = RenderIncremental.renderIncremental(hiddenState, visibleState)
  expect(addThumbs[0]).toBe(ViewletCommand.SetPatches)
  expect(addThumbs[2]).not.toEqual([])

  const removeThumbs = RenderIncremental.renderIncremental(visibleState, hiddenState)
  expect(removeThumbs[0]).toBe(ViewletCommand.SetPatches)
  expect(removeThumbs[2]).not.toEqual([])
})

test('renderIncremental fast patches a batched plain text append and updates its cached dom', () => {
  const initialState = createPlainTextState('', 0, { initial: true })
  const oldState = createPlainTextState('a', 9)
  const newState = createPlainTextState('abc', 27)

  RenderIncremental.renderIncremental(initialState, oldState)
  expect(RenderedDoms.getTextAppendPaths(3)).toBeDefined()
  expect(RenderPlainTextAppend.canRenderPlainTextAppend(oldState, newState)).toBe(true)
  const command = RenderIncremental.renderIncremental(oldState, newState)

  expect(command[0]).toBe(ViewletCommand.SetPatches)
  expect(command[1]).toBe(3)
  expect(command[2]).toContainEqual({ type: 1, value: 'abc' })
  expect(command[2]).toContainEqual({ key: 'translate', type: 3, value: '27px 0px' })
  expect(RenderedDoms.get(3)?.some((node: any) => node.text === 'abc')).toBe(true)
  expect(RenderedDoms.get(3)?.some((node: any) => node.className === 'EditorCursor' && node.translate === '27px 0px')).toBe(true)

  const laterState = createPlainTextState('abcde', 45)
  const laterCommand = RenderIncremental.renderIncremental(newState, laterState)
  expect(laterCommand[2]).toContainEqual({ type: 1, value: 'abcde' })
  expect(RenderedDoms.get(3)?.some((node: any) => node.text === 'abcde')).toBe(true)
})

test('renderIncremental falls back from plain text fast patches for replacement, newline, or diagnostics', () => {
  const initialState = createPlainTextState('', 0, { initial: true })
  const oldState = createPlainTextState('ab', 18)
  RenderIncremental.renderIncremental(initialState, oldState)

  expect(RenderPlainTextAppend.canRenderPlainTextAppend(oldState, createPlainTextState('ac', 18))).toBe(false)

  const newlineState = createPlainTextState('ab\n', 18, { lines: ['ab', ''] })
  expect(RenderPlainTextAppend.canRenderPlainTextAppend(oldState, newlineState)).toBe(false)

  const diagnosticState = createPlainTextState('abc', 27, {
    diagnostics: [{ rowIndex: 0, type: 'error' }],
    visualDecorations: [{ height: 2, type: 'error', width: 4, x: 0, y: 0 }],
  })
  expect(RenderPlainTextAppend.canRenderPlainTextAppend(oldState, diagnosticState)).toBe(false)
  const diagnostics = RenderIncremental.renderIncremental(oldState, diagnosticState)
  expect(diagnostics[2]).toContainEqual(expect.objectContaining({ type: 6 }))

  expect(RenderPlainTextAppend.canRenderPlainTextAppend(oldState, createPlainTextState('a', 9))).toBe(false)
  const selectedTextState = createPlainTextState('ab', 18, { selections: new Uint32Array([0, 0, 0, 2]) })
  const appendedTextState = createPlainTextState('abc', 27)
  expect(RenderPlainTextAppend.canRenderPlainTextAppend(selectedTextState, appendedTextState)).toBe(false)
  const beforeHorizontalScroll = createPlainTextState('a'.repeat(111), 999)
  const afterHorizontalScroll = createPlainTextState('a'.repeat(112), 1008)
  expect(RenderPlainTextAppend.canRenderPlainTextAppend(beforeHorizontalScroll, afterHorizontalScroll)).toBe(false)
  expect(RenderPlainTextAppend.canRenderPlainTextAppend(oldState, createPlainTextState('abc', 27, { minLineY: 1 }))).toBe(false)
  expect(RenderPlainTextAppend.canRenderPlainTextAppend(oldState, createPlainTextState('abc', 27, { languageId: 'html' }))).toBe(false)
})
