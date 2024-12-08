import { expect, test } from '@jest/globals'
import * as EditorStrings from '../src/parts/EditorStrings/EditorStrings.ts'

test('goToDefinition', () => {
  expect(EditorStrings.goToDefinition()).toBe('Go to Definition')
})

test('noDefinitionFound', () => {
  expect(EditorStrings.noDefinitionFound()).toBe('No definition found')
})

test('noDefinitionFoundFor', () => {
  const word = 'test'
  expect(EditorStrings.noDefinitionFoundFor(word)).toBe("No definition found for 'test'")
})

test('noTypeDefinitionFound', () => {
  expect(EditorStrings.noTypeDefinitionFound()).toBe('No type definition found')
})

test('noTypeDefinitionFoundFor', () => {
  const word = 'test'
  expect(EditorStrings.noTypeDefinitionFoundFor(word)).toBe("No type definition found for 'test'")
})

test('noResults', () => {
  expect(EditorStrings.noResults()).toBe('No Results')
})

test('sourceAction', () => {
  expect(EditorStrings.sourceAction()).toBe('Source Action')
})

test('sortImports', () => {
  expect(EditorStrings.sortImports()).toBe('Sort Imports')
})

test('organizeImports', () => {
  expect(EditorStrings.organizeImports()).toBe('Organize Imports')
})

test('escapeToClose', () => {
  expect(EditorStrings.escapeToClose()).toBe('Escape to close')
})

test('enterCode', () => {
  expect(EditorStrings.enterCode()).toBe('Enter Code')
})

test('formatDocument', () => {
  expect(EditorStrings.formatDocument()).toBe('Format Document')
})

test('editorShowHover', () => {
  expect(EditorStrings.editorShowHover()).toBe('Show Hover')
})

test('editorFormatDocumentForced', () => {
  expect(EditorStrings.editorFormatDocumentForced()).toBe('Editor: Format Document (forced)')
})

test('editorSelectNextOccurrence', () => {
  expect(EditorStrings.editorSelectNextOccurrence()).toBe('Editor: Select Next Occurrence')
})

test('editorSelectAllOccurrences', () => {
  expect(EditorStrings.editorSelectAllOccurrences()).toBe('Editor: Select All Occurrences')
})

test('editorGoToDefinition', () => {
  expect(EditorStrings.editorGoToDefinition()).toBe('Editor: Go To Definition')
})

test('editorGoToTypeDefinition', () => {
  expect(EditorStrings.editorGoToTypeDefinition()).toBe('Editor: Go To Type Definition')
})

test('editorSelectInsideString', () => {
  expect(EditorStrings.editorSelectInsideString()).toBe('Editor: Select Inside String')
})

test('editorIndent', () => {
  expect(EditorStrings.editorIndent()).toBe('Editor: Indent')
})

test('editorUnindent', () => {
  expect(EditorStrings.editorUnindent()).toBe('Editor: Unindent')
})

test('editorSortLinesAscending', () => {
  expect(EditorStrings.editorSortLinesAscending()).toBe('Editor: Sort Lines Ascending')
})

test('editorToggleComment', () => {
  expect(EditorStrings.editorToggleComment()).toBe('Editor: Toggle Comment')
})

test('editorSelectUp', () => {
  expect(EditorStrings.editorSelectUp()).toBe('Editor: Select Up')
})

test('editorSelectDown', () => {
  expect(EditorStrings.editorSelectDown()).toBe('Editor: Select Down')
})

test('toggleBlockComment', () => {
  expect(EditorStrings.toggleBlockComment()).toBe('Toggle Block Comment')
})

test('editorOpenColorPicker', () => {
  expect(EditorStrings.editorOpenColorPicker()).toBe('Editor: Open Color Picker')
})

test('editorCloseColorPicker', () => {
  expect(EditorStrings.editorCloseColorPicker()).toBe('Editor: Close Color Picker')
})

test('editorCopyLineDown', () => {
  expect(EditorStrings.editorCopyLineDown()).toBe('Editor: Copy Line Down')
})

test('editorCopyLineUp', () => {
  expect(EditorStrings.editorCopyLineUp()).toBe('Editor: Copy Line Up')
})

test('moveLineDown', () => {
  expect(EditorStrings.moveLineDown()).toBe('Move Line Down')
})

test('moveLineUp', () => {
  expect(EditorStrings.moveLineUp()).toBe('Move Line Up')
})

test('noCodeActionsAvailable', () => {
  expect(EditorStrings.noCodeActionsAvailable()).toBe('No code actions available')
})
