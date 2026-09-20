import { afterAll, expect, test } from '@jest/globals'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'
import * as GetColorPickerRange from '../src/parts/GetColorPickerRange/GetColorPickerRange.ts'

const originalOffscreenCanvas = typeof OffscreenCanvas === 'undefined' ? undefined : OffscreenCanvas
const mockState = { fillStyle: '' }
const mockContext = {
  get fillStyle(): string {
    return mockState.fillStyle
  },
  set fillStyle(value: string) {
    if (value === '#010203' || value.startsWith('#') || /^(?:hsla?|rgba?)\(/i.test(value)) {
      mockState.fillStyle = value
    } else if (value.toLowerCase() === 'orange') {
      mockState.fillStyle = '#ffa500'
    } else if (value.toLowerCase() === 'rebeccapurple') {
      mockState.fillStyle = '#663399'
    }
  },
}
Object.defineProperty(globalThis, 'OffscreenCanvas', {
  configurable: true,
  value: class {
    getContext(): typeof mockContext {
      return mockContext
    }
  },
})

afterAll(() => {
  Object.defineProperty(globalThis, 'OffscreenCanvas', {
    configurable: true,
    value: originalOffscreenCanvas,
  })
})

test('finds a short hex color under the cursor', async () => {
  const editor = {
    lines: ['x', '  color: #000;'],
    selections: EditorSelection.fromRange(1, 11, 1, 11),
  }
  expect(await GetColorPickerRange.getColorPickerRange(editor)).toEqual({ endOffset: 15, startOffset: 11, value: '#000' })
})

test('finds a functional color under the cursor', async () => {
  const editor = {
    lines: ['color: hsl(240, 100%, 50%);'],
    selections: EditorSelection.fromRange(0, 15, 0, 15),
  }
  expect(await GetColorPickerRange.getColorPickerRange(editor)).toEqual({ endOffset: 26, startOffset: 7, value: 'hsl(240, 100%, 50%)' })
})

test('finds a named color under the cursor', async () => {
  const editor = {
    lines: ['color: orange; background: blue;'],
    selections: EditorSelection.fromRange(0, 10, 0, 10),
  }
  expect(await GetColorPickerRange.getColorPickerRange(editor)).toEqual({ endOffset: 13, startOffset: 7, value: 'orange' })
})

test('finds a mixed-case named color under the cursor', async () => {
  const editor = {
    lines: ['color: ReBeccAPurple;'],
    selections: EditorSelection.fromRange(0, 12, 0, 12),
  }
  expect(await GetColorPickerRange.getColorPickerRange(editor)).toEqual({ endOffset: 20, startOffset: 7, value: 'ReBeccAPurple' })
})

test('does not find a named color inside an identifier', async () => {
  const editor = {
    lines: ['--orange-color: 1;'],
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  }
  expect(await GetColorPickerRange.getColorPickerRange(editor)).toEqual({ endOffset: -1, startOffset: -1, value: '' })
})

test('uses a non-empty single-line selection', async () => {
  const editor = {
    lines: ['color: rgba(1, 2, 3, 0.5);'],
    selections: EditorSelection.fromRange(0, 7, 0, 25),
  }
  expect(await GetColorPickerRange.getColorPickerRange(editor)).toEqual({ endOffset: 25, startOffset: 7, value: 'rgba(1, 2, 3, 0.5)' })
})

test('returns no range when the cursor is outside a color', async () => {
  const editor = {
    lines: ['color: #000;'],
    selections: EditorSelection.fromRange(0, 2, 0, 2),
  }
  expect(await GetColorPickerRange.getColorPickerRange(editor)).toEqual({ endOffset: -1, startOffset: -1, value: '' })
})

test('returns no range for a multi-line selection', async () => {
  const editor = {
    lines: ['color:', '#000'],
    selections: EditorSelection.fromRange(0, 2, 1, 2),
  }
  expect(await GetColorPickerRange.getColorPickerRange(editor)).toEqual({ endOffset: -1, startOffset: -1, value: '' })
})
