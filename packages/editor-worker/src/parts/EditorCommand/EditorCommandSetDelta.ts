import * as Assert from '../Assert/Assert.ts'
// @ts-ignore
import * as Clamp from '../Clamp/Clamp.ts'
// @ts-ignore
import * as Editor from '../Editor/Editor.ts'

export { setDeltaY, setDeltaYFixedValue } from '../Editor/Editor.ts'

// @ts-ignore
export const scrollByLines = (editor, lineCount) => {
  Assert.number(lineCount)
  return Editor.setDeltaY(editor, lineCount * editor.itemHeight)
}

// @ts-ignore
export const setDelta = (editor, deltaMode, eventDeltaX, eventDeltaY) => {
  Assert.number(deltaMode)
  Assert.number(eventDeltaX)
  Assert.number(eventDeltaY)
  // @ts-ignore
  const { deltaX } = editor
  if (eventDeltaX === 0) {
    return Editor.setDeltaY(editor, eventDeltaY)
  }
  const newDeltaX = Clamp.clamp(deltaX + eventDeltaX, 0, Infinity)
  return {
    ...Editor.setDeltaY(editor, eventDeltaY),
    deltaX: newDeltaX,
  }
}
