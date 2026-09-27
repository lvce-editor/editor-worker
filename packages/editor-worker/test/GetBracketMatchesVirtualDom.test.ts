import { expect, test } from '@jest/globals'
import { getBracketMatchesVirtualDom } from '../src/parts/GetBracketMatchesVirtualDom/GetBracketMatchesVirtualDom.ts'

test('getBracketMatchesVirtualDom renders positioned bracket highlights', () => {
  expect(getBracketMatchesVirtualDom([{ height: 20, width: 8, x: 16, y: 40 }])).toEqual([
    {
      childCount: 0,
      className: 'BracketMatch',
      height: 20,
      left: 16,
      top: 40,
      type: 4,
      width: 8,
    },
  ])
})
