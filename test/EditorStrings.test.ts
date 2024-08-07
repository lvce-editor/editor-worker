import { expect, test } from '@jest/globals'
import * as EditorStrings from '../src/parts/EditorStrings/EditorStrings.ts'

test('goToDefinition', () => {
  expect(EditorStrings.goToDefinition()).toBe('Go To Definition')
})
