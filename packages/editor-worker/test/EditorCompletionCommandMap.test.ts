import { expect, test } from '@jest/globals'
import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'
import * as EditorCommandHandleMouseLeave from '../src/parts/EditorCommand/EditorCommandHandleMouseLeave.ts'
import * as EditorCompletionWidget from '../src/parts/EditorCompletionWidget/EditorCompletionWidget.ts'

test('registers focusLast', () => {
  expect(commandMap['EditorCompletion.focusLast']).toBe(EditorCompletionWidget.focusLast)
})

test('registers hover pointer leave and re-entry handlers', () => {
  expect(commandMap['EditorCompletion.handleMouseEnter']).toBe(EditorCommandHandleMouseLeave.handleMouseEnter)
  expect(commandMap['EditorCompletion.handleMouseLeave']).toBe(EditorCommandHandleMouseLeave.handleMouseLeave)
})
