import { expect, test } from '@jest/globals'
import { getFindWidgetWorkerCommandMap } from '../src/parts/GetFindWidgetWorkerCommandMap/GetFindWidgetWorkerCommandMap.ts'

test('provides editor callbacks to the find widget worker', () => {
  expect(Object.keys(getFindWidgetWorkerCommandMap())).toEqual([
    'Editor.applyDocumentEdits',
    'Editor.closeFind2',
    'Editor.getLines2',
    'Editor.getSelections2',
    'Editor.setSelections2',
  ])
})
