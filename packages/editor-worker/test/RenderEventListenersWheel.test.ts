import { expect, test } from '@jest/globals'
import { EventExpression } from '@lvce-editor/constants'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as RenderEventListeners from '../src/parts/RenderEventListeners/RenderEventListeners.ts'

test('renderEventListeners - wheel listener forwards deltaX and deltaY', () => {
  const eventListeners = RenderEventListeners.renderEventListeners()
  const wheelListener = eventListeners.find((listener) => listener.name === DomEventListenerFunctions.HandleWheel)
  expect(wheelListener).toEqual({
    name: DomEventListenerFunctions.HandleWheel,
    params: ['handleWheel', EventExpression.DeltaMode, 'event.deltaX', EventExpression.DeltaY],
    passive: true,
  })
})
