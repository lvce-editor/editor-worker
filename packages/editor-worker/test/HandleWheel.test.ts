import { expect, test } from '@jest/globals'
import type { VirtualListState } from '../src/parts/VirtualListState/VirtualListState.ts'
import * as HandleWheel from '../src/parts/HandleWheel/HandleWheel.ts'
import * as WheelEventType from '../src/parts/WheelEventType/WheelEventType.ts'

test.skip('handleWheel - scroll down', async () => {
  const state: VirtualListState<number> = {
    deltaY: 0,
    finalDeltaY: 3 * 62 - 124,
    headerHeight: 0,
    height: 124,
    itemHeight: 62,
    items: [1, 2, 3],
    maxLineY: 0,
    minLineY: 0,
    width: 0,
    x: 0,
    y: 0,
  }
  expect(await HandleWheel.handleWheel(state, WheelEventType.DomDeltaPixel, 62)).toMatchObject({
    deltaY: 62,
    minLineY: 1,
  })
})

test.skip('handleWheel - scroll up', async () => {
  const state: VirtualListState<number> = {
    deltaY: 62,
    finalDeltaY: 3 * 62 - 124,
    headerHeight: 0,
    height: 124,
    itemHeight: 62,
    items: [1, 2, 3],
    maxLineY: 0,
    minLineY: 0,
    width: 0,
    x: 0,
    y: 0,
  }
  expect(await HandleWheel.handleWheel(state, WheelEventType.DomDeltaPixel, -62)).toMatchObject({
    deltaY: 0,
    minLineY: 0,
  })
})
