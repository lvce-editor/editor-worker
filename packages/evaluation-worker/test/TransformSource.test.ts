import { expect, test } from '@jest/globals'
import * as TransformSource from '../src/parts/TransformSource/TransformSource.ts'

test('transformSource - rewrites end-of-line markers to preview calls', () => {
  const result = TransformSource.transformSource('const value = 1\nvalue + 1//?')

  expect(result).toEqual({
    code: 'const value = 1\n__preview__(1, value + 1)\n',
    markerLines: [1],
  })
})
