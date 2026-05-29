import * as ClickDetailType from '../ClickDetailType/ClickDetailType.ts'
import * as ModifierKey from '../ModifierKey/ModifierKey.ts'
import * as EditorHandleDoubleClick from './EditorCommandHandleDoubleClick.ts'
import * as EditorHandleSingleClick from './EditorCommandHandleSingleClick.ts'
import * as EditorHandleTripleClick from './EditorCommandHandleTripleClick.ts'

const getModifier = (altKey: boolean, ctrlKey: boolean): number => {
  if (altKey) {
    return ModifierKey.Alt
  }
  if (ctrlKey) {
    return ModifierKey.Ctrl
  }
  return 0
}

export const handleMouseDown = (state: any, button: number, altKey: boolean, ctrlKey: boolean, x: number, y: number, detail: any) => {
  void button
  const modifier = getModifier(altKey, ctrlKey)
  switch (detail) {
    case ClickDetailType.Double:
      return EditorHandleDoubleClick.handleDoubleClick(state, modifier, x, y)
    case ClickDetailType.Single:
      return EditorHandleSingleClick.handleSingleClick(state, modifier, x, y)
    case ClickDetailType.Triple:
      return EditorHandleTripleClick.handleTripleClick(state, modifier, x, y)
    default:
      return state
  }
}
