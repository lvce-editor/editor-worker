import type { EditorState } from '../State/State.ts'
import * as WrapCommands from '../WrapCommands/WrapCommands.ts'

// State and undo history belong in this worker. Rendering reads changes separately.
export const wrapCommand = (fn: Parameters<typeof WrapCommands.wrapCommand>[0], preservesTypingCoalescing = false) => {
  return WrapCommands.wrapCommand(fn, preservesTypingCoalescing, false)
}

export const wrapFocusCommand = (fn: (editor: EditorState) => EditorState | Promise<EditorState>) => {
  return WrapCommands.wrapFocusCommand(fn, false)
}
