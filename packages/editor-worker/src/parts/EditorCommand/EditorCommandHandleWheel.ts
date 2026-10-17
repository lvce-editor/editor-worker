import * as SetDelta from './EditorCommandSetDelta.ts'

// Keep wheel handling as a dedicated command entry point and delegate
// the actual scroll state update to the shared setDelta logic.
// @ts-ignore
export const handleWheel = (editor, deltaMode, eventDeltaX, eventDeltaY) => {
  return SetDelta.setDelta(editor, deltaMode, eventDeltaX, eventDeltaY)
}
