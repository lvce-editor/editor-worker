import { afterEach, beforeEach, expect, test } from '@jest/globals'
import { TextMeasurementWorker } from '@lvce-editor/rpc-registry'
import { diffTree } from '@lvce-editor/virtual-dom-worker'
import { createStandaloneEditor } from '../src/parts/CreateStandaloneEditor/CreateStandaloneEditor.ts'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { setSelections2 } from '../src/parts/ExternalGetPositionAtCursor/ExternalGetPositionAtCursor.ts'
import { render2 } from '../src/parts/Render2/Render2.ts'
import * as RenderedDoms from '../src/parts/RenderedDoms/RenderedDoms.ts'

// Supply the font service; editor state, derived state, diff and render are real.
beforeEach(() => {
  TextMeasurementWorker.set({
    invoke: async (method: string, value: any) => {
      const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
      if (method === 'TextMeasurement.measureTextWidth') {
        return [...segmenter.segment(value)].length * 9
      }
      if (method === 'TextMeasurement.getGraphemeSegments') {
        return value.map((line: string) => [...Array.from(segmenter.segment(line), ({ index }) => index), line.length])
      }
      throw new Error(`unexpected font service command ${method}`)
    },
  } as any)
})

afterEach(() => {
  TextMeasurementWorker.set(undefined as any)
  EditorStates.dispose(905)
  RenderedDoms.clear()
})

test.each([
  { content: 'first line\nsecond line', height: 600, selections: [1, 0, 1, 6], visible: 'second line' },
  { content: 'first line\nsecond line', height: 20, selections: [1, 0, 1, 6], visible: 'second line' },
  { content: 'a\u{301} and 👩‍💻', height: 600, selections: [0, 0, 0, 2], visible: 'a\u{301} and 👩‍💻' },
])(
  'the first render includes loaded text and a restored selection together ($height, $visible)',
  async ({ content, height, selections, visible }) => {
    await createStandaloneEditor({
      assetDir: '/assets',
      charWidth: 9,
      content,
      fontFamily: 'monospace',
      fontSize: 15,
      fontWeight: 400,
      height,
      id: 905,
      languageId: 'plaintext',
      letterSpacing: 0,
      lineNumbers: false,
      platform: 2,
      rowHeight: 20,
      tabSize: 2,
      tokenizePath: '',
      uri: 'memfs:///initial-selection.txt',
      width: 800,
      x: 0,
      y: 0,
    })
    await setSelections2(905, new Uint32Array(selections))
    const commands = render2(905, [])
    const dom = RenderedDoms.get(905)!
    expect(dom.some((node: any) => node.text === visible)).toBe(true)
    expect(commands).toContainEqual(['Viewlet.setPatches', 905, diffTree([], dom)])
    expect(EditorStates.get(905).newState.selections).toEqual(new Uint32Array(selections))
  },
)
