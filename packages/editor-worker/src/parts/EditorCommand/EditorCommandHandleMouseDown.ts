import * as ClickDetailType from '../ClickDetailType/ClickDetailType.ts'
import * as GetModifier from '../GetModifier/GetModifier.ts'
import * as EditorHandleDoubleClick from './EditorCommandHandleDoubleClick.ts'
import * as EditorHandleSingleClick from './EditorCommandHandleSingleClick.ts'
import * as EditorHandleTripleClick from './EditorCommandHandleTripleClick.ts'

export const handleMouseDown = (state: any, button: number, altKey: boolean, ctrlKey: boolean, x: number, y: number, detail: any) => {
  const modifier = GetModifier.getModifier(altKey, ctrlKey)
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
