import { expect, test } from '@jest/globals'
import type { Widget } from '../src/parts/Widget/Widget.ts'
import * as RemoveWidget from '../src/parts/RemoveWidget/RemoveWidget.ts'

test('remove widget', () => {
  interface TestState {
    readonly uid: number
  }
  interface TestWidget extends Widget<TestState> {}
  const widget: TestWidget = {
    id: 'test',
    newState: {
      uid: 123,
    },
    oldState: {
      uid: 123,
    },
  }
  expect(RemoveWidget.removeWidget(widget)).toEqual([['Viewlet.send', 123, 'dispose']])
})
