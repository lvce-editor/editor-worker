import { expect, test } from '@jest/globals'
import * as RemoveWidget from '../src/parts/RemoveWidget/RemoveWidget.ts'
import type { Widget } from '../src/parts/Widget/Widget.ts'

test('remove widget', () => {
  interface TestState {
    readonly uid: number
  }
  interface TestWidget extends Widget<TestState> {}
  const widget: TestWidget = {
    id: 'test',
    oldState: {
      uid: 123,
    },
    newState: {
      uid: 123,
    },
  }
  expect(RemoveWidget.removeWidget(widget)).toEqual([['Viewlet.send', 123, 'dispose']])
})
