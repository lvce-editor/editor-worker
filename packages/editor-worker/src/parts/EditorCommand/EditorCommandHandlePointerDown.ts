import * as ClickDetailType from '../ClickDetailType/ClickDetailType.ts'
import * as EditorHandleDoubleClick from './EditorCommandHandleDoubleClick.ts'
import * as EditorHandleSingleClick from './EditorCommandHandleSingleClick.ts'
import * as EditorHandleTripleClick from './EditorCommandHandleTripleClick.ts'

export const handlePointerDown = (state: any, button: number, altKey: number, ctrlKey: number, x: number, y: number, detail: any) => {
  const modifier = 0
  detail = ClickDetailType.Single // TODO
  // console.log({ detail })
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
