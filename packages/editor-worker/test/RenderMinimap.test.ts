import { expect, test } from '@jest/globals'
import * as RenderMinimap from '../src/parts/RenderMinimap/RenderMinimap.ts'

test('renders the minimap through the viewlet canvas lifecycle command', () => {
  const state = {
    deltaY: 0,
    finalDeltaY: 0,
    height: 80,
    minimapEnabled: true,
    minimapLines: [[4, 'Token Keyword']],
    minimapRevision: 2,
    minLineY: 0,
    numberOfVisibleLines: 1,
    uid: 42,
  }

  const command = RenderMinimap.renderMinimap({} as any, state as any)

  expect(command.slice(0, 6)).toEqual(['Viewlet.renderCanvas', 42, '.EditorMinimap', 'EditorMinimapCanvas', 120, 80])
  expect(command.at(-1)).toBe('2:0')
})

test('does not render when the minimap is disabled', () => {
  expect(RenderMinimap.renderMinimap({} as any, { minimapEnabled: false } as any)).toEqual([])
})
