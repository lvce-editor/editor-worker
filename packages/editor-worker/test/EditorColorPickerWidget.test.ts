import { expect, test } from '@jest/globals'
import * as EditorColorPickerWidget from '../src/parts/EditorColorPickerWidget/EditorColorPickerWidget.ts'

test('forwards focus commands to the renderer', () => {
  const focusCommand = ['Viewlet.focusSelector', 42, '.ColorPicker']
  const widget = {
    newState: { commands: [focusCommand], uid: 42 },
    oldState: { commands: [], uid: 42 },
  }
  expect(EditorColorPickerWidget.render(widget as any)).toEqual([focusCommand])
})
