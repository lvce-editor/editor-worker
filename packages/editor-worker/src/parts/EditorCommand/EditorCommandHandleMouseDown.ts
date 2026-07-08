import type { EditorState } from '../State/State.ts'
import * as ClickDetailType from '../ClickDetailType/ClickDetailType.ts'
import * as GetModifier from '../GetModifier/GetModifier.ts'
import * as EditorHandleDoubleClick from './EditorCommandHandleDoubleClick.ts'
import * as EditorHandleSingleClick from './EditorCommandHandleSingleClick.ts'
import * as EditorHandleTripleClick from './EditorCommandHandleTripleClick.ts'

const PrimaryButton = 0

export const handleMouseDown = async (
  state: EditorState,
  button: number,
  altKey: boolean,
  ctrlKey: boolean,
  x: number,
  y: number,
  detail: any,
): Promise<EditorState> => {
  if (button !== PrimaryButton) {
    return state
  }
  const modifier = GetModifier.getModifier(altKey, ctrlKey)
  let newState
  switch (detail) {
    case ClickDetailType.Double:
      newState = await EditorHandleDoubleClick.handleDoubleClick(state, modifier, x, y)
      break
    case ClickDetailType.Single:
      newState = await EditorHandleSingleClick.handleSingleClick(state, modifier, x, y)
      break
    case ClickDetailType.Triple:
      newState = EditorHandleTripleClick.handleTripleClick(state, modifier, x, y)
      break
    default:
      return state
  }
  return {
    ...newState,
    isSelecting: true,
  }
}
