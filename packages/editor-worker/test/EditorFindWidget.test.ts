import { expect, test } from '@jest/globals'
import { WidgetId } from '@lvce-editor/constants'
import * as EditorFindWidget from '../src/parts/EditorFindWidget/EditorFindWidget.ts'

const FindWidgetHandleFocus = 9

test('render adds missing find widget focus listener', () => {
  const widget: any = {
    newState: {
      commands: [
        [
          'Viewlet.registerEventListeners',
          100,
          [
            {
              name: 12,
              params: ['executeWidgetCommand', 'FindWidget', 'FindWidget.handleInput', 0, WidgetId.Find, 'event.target.value'],
            },
          ],
        ],
      ],
      uid: 100,
    },
    oldState: {
      commands: [],
    },
  }

  expect(EditorFindWidget.render(widget)).toEqual([
    [
      'Viewlet.registerEventListeners',
      100,
      [
        {
          name: 12,
          params: ['executeWidgetCommand', 'FindWidget', 'FindWidget.handleInput', 0, WidgetId.Find, 'event.target.value'],
        },
        {
          name: FindWidgetHandleFocus,
          params: ['executeWidgetCommand', 'FindWidget', 'FindWidget.handleFocus', 0, WidgetId.Find],
        },
      ],
    ],
  ])
})

test('render does not duplicate find widget focus listener', () => {
  const focusListener = {
    name: FindWidgetHandleFocus,
    params: ['executeWidgetCommand', 'FindWidget', 'FindWidget.handleFocus', 0, WidgetId.Find],
  }
  const widget: any = {
    newState: {
      commands: [['Viewlet.registerEventListeners', 100, [focusListener]]],
      uid: 100,
    },
    oldState: {
      commands: [],
    },
  }

  expect(EditorFindWidget.render(widget)).toEqual([['Viewlet.registerEventListeners', 100, [focusListener]]])
})
