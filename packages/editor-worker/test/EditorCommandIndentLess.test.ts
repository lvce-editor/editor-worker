import { expect, test } from '@jest/globals'
import { KeyCode, KeyModifier } from '@lvce-editor/constants'
import { MockRpc } from '@lvce-editor/rpc'
import { ExtensionHost, RendererWorker, SyntaxHighlightingWorker, TextMeasurementWorker } from '@lvce-editor/rpc-registry'

const mockRpc = MockRpc.create({ commandMap: {}, invoke: async () => undefined })
ExtensionHost.set(mockRpc)
RendererWorker.set(mockRpc)
SyntaxHighlightingWorker.set(MockRpc.create({ commandMap: {}, invoke: async () => [{}] }))
TextMeasurementWorker.set(MockRpc.create({ commandMap: {}, invoke: async (_method: string, text: string) => text.length * 8 }))

import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'
import * as EditorIndentLess from '../src/parts/EditorCommand/EditorCommandIndentLess.ts'
import * as EditorCommandUndo from '../src/parts/EditorCommand/EditorCommandUndo.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'
import { emptyEditor } from '../src/parts/EmptyEditor/EmptyEditor.ts'
import * as GetKeyBindings from '../src/parts/GetKeyBindings/GetKeyBindings.ts'
import * as WhenExpression from '../src/parts/WhenExpression/WhenExpression.ts'

const createEditor = (lines: string[], selections = EditorSelection.fromRange(0, 0, 0, 0), insertSpaces = true) => ({
  ...emptyEditor,
  insertSpaces,
  invalidStartIndex: 0,
  lines,
  numberOfVisibleLines: 32,
  selections,
  tabSize: 2,
  uid: lines.join('').length,
})

test('Ctrl/Cmd+[ is bound to a registered indent-less command', () => {
  expect(GetKeyBindings.getKeyBindings()).toContainEqual({
    command: 'Editor.indentLess',
    key: KeyModifier.CtrlCmd | KeyCode.BracketLeft,
    when: WhenExpression.FocusEditorText,
  })
  expect(commandMap['Editor.indentLess']).toBeDefined()
  expect(commandMap['Editor.unindent']).toBeDefined()
  expect('Editor.indendLess' in commandMap).toBe(false)
})

test('editorIndentLess leaves an unindented line intact', async () => {
  const editor = createEditor(['line 1'])
  await expect(EditorIndentLess.indentLess(editor)).resolves.toMatchObject({
    lines: ['line 1'],
    selections: editor.selections,
  })
})

test('editorIndentLess removes one indentation level without removing text', async () => {
  const editor = createEditor(['   line 1'])
  const updatedEditor = await EditorIndentLess.indentLess(editor)
  expect(updatedEditor.lines).toEqual([' line 1'])
  expect(updatedEditor.undoStack).toHaveLength(1)
  const undoneEditor = await EditorCommandUndo.undo(updatedEditor)
  expect(undoneEditor.lines).toEqual(['   line 1'])
  expect(undoneEditor.selections).toEqual(editor.selections)
})

test('editorIndentLess removes a leading tab', async () => {
  const editor = createEditor(['\tline 1'])
  await expect(EditorIndentLess.indentLess(editor)).resolves.toMatchObject({
    lines: ['line 1'],
  })
})

test('editorIndentLess removes one indentation width when spaces are used with tabs configured', async () => {
  const editor = createEditor(['    line 1'], undefined, false)
  await expect(EditorIndentLess.indentLess(editor)).resolves.toMatchObject({
    lines: ['  line 1'],
  })
})

test('editorIndentLess removes indentation from selected lines only', async () => {
  const selections = EditorSelection.fromRange(0, 0, 1, 0)
  const editor = createEditor(['  line 1', '  line 2', '  line 3'], selections)
  await expect(EditorIndentLess.indentLess(editor)).resolves.toMatchObject({
    lines: ['line 1', 'line 2', '  line 3'],
  })
})
