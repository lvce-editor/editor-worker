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
      params: ['handleInput', 'event.clientX', 'event.clientY', 'event.altKey'],
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
      params: ['setDelta', 'event.deltaMode', 'event.deltaY'],
      preventDefault: true,
    },
    {
      name: DomEventListenerFunctions.HandleContextMenu,
      params: ['handleContextMenu', 'event.button', 'event.clientX', 'event.clientY'],
      preventDefault: true,
    },
  ]
}
