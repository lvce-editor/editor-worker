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
  expect(EditorStrings.escapeToClose()).toBe('Press Escape to close')
})

test('enterCode', () => {
  expect(EditorStrings.enterCode()).toBe('Enter code')
})

test('formatDocument', () => {
  expect(EditorStrings.formatDocument()).toBe('Format Document')
})

test('editorShowHover', () => {
  expect(EditorStrings.editorShowHover()).toBe('Show Hover')
})

test('editorFormatDocumentForced', () => {
  expect(EditorStrings.editorFormatDocumentForced()).toBe('Format Document (Forced)')
})

test('editorSelectNextOccurrence', () => {
  expect(EditorStrings.editorSelectNextOccurrence()).toBe('Select Next Occurrence')
})

test('editorSelectAllOccurrences', () => {
  expect(EditorStrings.editorSelectAllOccurrences()).toBe('Select All Occurrences')
})

test('editorGoToDefinition', () => {
  expect(EditorStrings.editorGoToDefinition()).toBe('Go to Definition')
})

test('editorGoToTypeDefinition', () => {
  expect(EditorStrings.editorGoToTypeDefinition()).toBe('Go to Type Definition')
})

test('editorSelectInsideString', () => {
  expect(EditorStrings.editorSelectInsideString()).toBe('Select Inside String')
})

test('editorIndent', () => {
  expect(EditorStrings.editorIndent()).toBe('Indent')
})

test('editorUnindent', () => {
  expect(EditorStrings.editorUnindent()).toBe('Unindent')
})

test('editorSortLinesAscending', () => {
  expect(EditorStrings.editorSortLinesAscending()).toBe('Sort Lines Ascending')
})

test('editorToggleComment', () => {
  expect(EditorStrings.editorToggleComment()).toBe('Toggle Comment')
})

test('editorSelectUp', () => {
  expect(EditorStrings.editorSelectUp()).toBe('Select Up')
})

test('editorSelectDown', () => {
  expect(EditorStrings.editorSelectDown()).toBe('Select Down')
})

test('toggleBlockComment', () => {
  expect(EditorStrings.toggleBlockComment()).toBe('Toggle Block Comment')
})

test('editorOpenColorPicker', () => {
  expect(EditorStrings.editorOpenColorPicker()).toBe('Open Color Picker')
})

test('editorCloseColorPicker', () => {
  expect(EditorStrings.editorCloseColorPicker()).toBe('Close Color Picker')
})

test('editorCopyLineDown', () => {
  expect(EditorStrings.editorCopyLineDown()).toBe('Copy Line Down')
})

test('editorCopyLineUp', () => {
  expect(EditorStrings.editorCopyLineUp()).toBe('Copy Line Up')
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
