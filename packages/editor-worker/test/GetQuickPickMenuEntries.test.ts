import { expect, test } from '@jest/globals'
import { getQuickPickMenuEntries } from '../src/parts/GetQuickPickMenuEntries/GetQuickPickMenuEntries.ts'

test('includes change language mode command', () => {
  expect(getQuickPickMenuEntries()).toContainEqual({
    args: ['QuickPick', 'language-mode'],
    id: 'Viewlet.openWidget',
    label: 'Change Language Mode',
  })
})
