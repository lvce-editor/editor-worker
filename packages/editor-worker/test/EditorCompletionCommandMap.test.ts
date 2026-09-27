import { expect, test } from '@jest/globals'
import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'
import * as EditorCompletionWidget from '../src/parts/EditorCompletionWidget/EditorCompletionWidget.ts'

test('registers focusLast', () => {
  expect(commandMap['EditorCompletion.focusLast']).toBe(EditorCompletionWidget.focusLast)
})
