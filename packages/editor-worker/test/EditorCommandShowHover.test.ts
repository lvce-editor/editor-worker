import { afterEach, expect, jest, test } from '@jest/globals'
import { WidgetId } from '@lvce-editor/constants'
import * as WidgetRevision from '../src/parts/WidgetRevision/WidgetRevision.ts'

const loadHoverContent = jest.fn<(...args: any[]) => Promise<any>>()

jest.unstable_mockModule('../src/parts/LoadHoverContent/LoadHoverContent.ts', () => ({
  loadHoverContent,
}))

const EditorCommandShowHover = await import('../src/parts/EditorCommand/EditorCommandShowHover.ts')

const hoverState = {
  commands: [],
  content: '',
  diagnostics: [],
  documentation: '',
  editorUid: 1,
  height: 0,
  lineInfos: [],
  uid: 2,
  width: 0,
  x: 0,
  y: 0,
}

const hoverWidget = {
  id: WidgetId.Hover,
  newState: hoverState,
  oldState: hoverState,
}

const editor = {
  additionalFocus: 51,
  focused: false,
  uid: 1,
  widgets: [hoverWidget],
}

afterEach(() => {
  loadHoverContent.mockReset()
  WidgetRevision.reset()
})

test('removes an existing hover when the new pointer position has no content', async () => {
  loadHoverContent.mockResolvedValue(undefined)

  const result = await EditorCommandShowHover.showHover(editor, { columnIndex: 20, rowIndex: 0 })

  expect(result.widgets).toEqual([])
  expect(result.additionalFocus).toBe(0)
  expect(result.focused).toBe(true)
})

test('updates an existing hover at the new pointer position', async () => {
  const newState = {
    ...hoverState,
    diagnostics: [{ message: 'new diagnostic' }],
    x: 100,
  }
  loadHoverContent.mockResolvedValue(newState)

  const result = await EditorCommandShowHover.showHover(editor, { columnIndex: 8, rowIndex: 0 })

  expect(result.widgets).toEqual([
    {
      ...hoverWidget,
      newState,
      oldState: hoverState,
    },
  ])
})
