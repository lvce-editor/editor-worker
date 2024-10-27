import { expect, test } from '@jest/globals'
import * as GetSourceActionsVirtualDom from '../src/parts/GetSourceActionsVirtualDom/GetSourceActionsVirtualDom.ts'

test('getSourceActionsVirtualDom - empty', () => {
  const sourceActions: any[] = []
  const dom = GetSourceActionsVirtualDom.getSourceActionsVirtualDom(sourceActions)
  expect(dom).toEqual([
    {
      childCount: 2,
      className: 'Viewlet EditorSourceActions',
      onFocusIn: 'handleFocusIn',
      tabIndex: -1,
      type: 4,
    },
    {
      childCount: 1,
      className: 'SourceActionHeading',
      type: 4,
    },
    {
      childCount: 0,
      text: 'Source Action',
      type: 12,
    },
    {
      childCount: 0,
      className: 'EditorSourceActionsList',
      onClick: 'handleClick',
      type: 4,
    },
  ])
})
