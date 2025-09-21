import { expect, test } from '@jest/globals'
import type { VirtualListState } from '../src/parts/VirtualListState/VirtualListState.ts'
import * as HandleWheel from '../src/parts/HandleWheel/HandleWheel.ts'
import * as WheelEventType from '../src/parts/WheelEventType/WheelEventType.ts'

test.skip('handleWheel - scroll down', async () => {
  const state: VirtualListState<number> = {
    itemHeight: 62,
    headerHeight: 0,
    minLineY: 0,
    maxLineY: 0,
    items: [1, 2, 3],
    height: 124,
    deltaY: 0,
    finalDeltaY: 3 * 62 - 124,
    x: 0,
    y: 0,
    width: 0,
  }
  expect(await HandleWheel.handleWheel(state, WheelEventType.DomDeltaPixel, 62)).toMatchObject({
    minLineY: 1,
    deltaY: 62,
  })
})

test.skip('handleWheel - scroll up', async () => {
  const state: VirtualListState<number> = {
    x: 0,
    y: 0,
    width: 0,
    headerHeight: 0,
    minLineY: 0,
    maxLineY: 0,
    itemHeight: 62,
    items: [1, 2, 3],
    height: 124,
    deltaY: 62,
    finalDeltaY: 3 * 62 - 124,
  }
  expect(await HandleWheel.handleWheel(state, WheelEventType.DomDeltaPixel, -62)).toMatchObject({
    deltaY: 0,
    minLineY: 0,
  })
})
