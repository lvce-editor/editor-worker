import { expect, test } from '@jest/globals'
import * as SourceActionWidgetFactory from '../src/parts/SourceActionWidgetFactory/SourceActionWidgetFactory.ts'

test('create', () => {
  const widget = SourceActionWidgetFactory.create()
  expect(widget.newState.editorUid).toBe(0)
  expect(widget.oldState.editorUid).toBe(0)
})
