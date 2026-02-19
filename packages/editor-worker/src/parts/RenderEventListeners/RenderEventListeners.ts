import { EventExpression } from '@lvce-editor/constants'
import type { DomEventListener } from '../DomEventListener/DomEventListener.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

export const renderEventListeners = (): readonly DomEventListener[] => {
  return [
    {
      name: DomEventListenerFunctions.HandleFocus,
      params: ['handleFocus'],
    },
    {
      name: DomEventListenerFunctions.HandleMouseMove,
      params: ['handleInput', EventExpression.ClientX, EventExpression.ClientY, EventExpression.AltKey],
    },
    {
      name: DomEventListenerFunctions.HandleBlur,
      params: ['handleBlur'],
    },
    {
      name: DomEventListenerFunctions.HandleBeforeInput,
      params: ['handleBeforeInput', 'event.inputType', 'event.data'],
    },
    {
      name: DomEventListenerFunctions.HandleCompositionStart,
      params: ['compositionStart', 'event.data'],
    },
    {
      name: DomEventListenerFunctions.HandleCompositionUpdate,
      params: ['compositionUpdate', 'event.data'],
    },
    {
      name: DomEventListenerFunctions.HandleCompositionEnd,
      params: ['compositionUpdate', 'event.data'],
    },
    {
      name: DomEventListenerFunctions.HandleCut,
      params: ['cut'],
      preventDefault: true,
    },
    {
      name: DomEventListenerFunctions.HandleWheel,
<<<<<<< HEAD
      params: ['setDelta', 'event.deltaMode', 'event.deltaY'],
      passive: true,
=======
      params: ['setDelta', EventExpression.DeltaMode, EventExpression.DeltaY],
      preventDefault: true,
>>>>>>> origin/main
    },
    {
      name: DomEventListenerFunctions.HandleContextMenu,
      params: ['handleContextMenu', EventExpression.Button, EventExpression.ClientX, EventExpression.ClientY],
      preventDefault: true,
    },
  ]
}
