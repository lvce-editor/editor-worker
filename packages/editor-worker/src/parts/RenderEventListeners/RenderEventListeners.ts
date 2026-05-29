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
      params: ['handleMouseMove', EventExpression.ClientX, EventExpression.ClientY, EventExpression.AltKey],
    },
    {
      name: DomEventListenerFunctions.HandleBlur,
      params: ['handleBlur'],
    },
    {
      name: DomEventListenerFunctions.HandleBeforeInput,
      params: ['handleBeforeInput', 'event.inputType', 'event.data'],
      preventDefault: true,
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
      params: ['compositionEnd', 'event.data'],
    },
    {
      name: DomEventListenerFunctions.HandleCut,
      params: ['cut'],
      preventDefault: true,
    },
    {
      name: DomEventListenerFunctions.HandlePaste,
      params: ['paste', 'event.clipboardData ? event.clipboardData.getData("text/plain") : ""'],
      preventDefault: true,
    },
    {
      name: DomEventListenerFunctions.HandlePointerDown,
      params: ['handlePointerDown', 'event.button', 'event.altKey', 'event.ctrlKey', EventExpression.ClientX, EventExpression.ClientY],
      trackPointerEvents: [DomEventListenerFunctions.HandlePointerMove, DomEventListenerFunctions.HandlePointerUp],
    },
    {
      name: DomEventListenerFunctions.HandlePointerMove,
      params: ['handlePointerMove', EventExpression.ClientX, EventExpression.ClientY, EventExpression.AltKey],
    },
    {
      name: DomEventListenerFunctions.HandlePointerUp,
      params: ['handlePointerUp'],
    },
    {
      name: DomEventListenerFunctions.HandleWheel,
      params: ['setDelta', EventExpression.DeltaMode, EventExpression.DeltaY],
      passive: true,
    },
    {
      name: DomEventListenerFunctions.HandleContextMenu,
      params: ['handleContextMenu', EventExpression.Button, EventExpression.ClientX, EventExpression.ClientY],
      preventDefault: true,
    },
    {
      name: DomEventListenerFunctions.HandleScrollBarVerticalPointerDown,
      params: ['handleScrollBarVerticalPointerDown', EventExpression.ClientY],
      trackPointerEvents: [DomEventListenerFunctions.HandleScrollBarVerticalPointerMove, DomEventListenerFunctions.HandleScrollBarVerticalPointerUp],
    },
    {
      name: DomEventListenerFunctions.HandleScrollBarVerticalPointerMove,
      params: ['handleScrollBarVerticalPointerMove', EventExpression.ClientY],
    },
    {
      name: DomEventListenerFunctions.HandleScrollBarVerticalPointerUp,
      params: ['handlePointerUp'],
    },
    {
      name: DomEventListenerFunctions.HandleScrollBarHorizontalPointerDown,
      params: ['handleScrollBarHorizontalPointerDown', EventExpression.ClientX],
      trackPointerEvents: [
        DomEventListenerFunctions.HandleScrollBarHorizontalPointerMove,
        DomEventListenerFunctions.HandleScrollBarHorizontalPointerUp,
      ],
    },
    {
      name: DomEventListenerFunctions.HandleScrollBarHorizontalPointerMove,
      params: ['handleScrollBarHorizontalMove', EventExpression.ClientX],
    },
    {
      name: DomEventListenerFunctions.HandleScrollBarHorizontalPointerUp,
      params: ['handlePointerUp'],
    },
  ]
}
