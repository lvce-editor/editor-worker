import type { EditorState } from '../State/State.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as GetComponentState from '../GetComponentState/GetComponentState.ts'
import * as UpdateDerivedState from '../UpdateDerivedState/UpdateDerivedState.ts'

const restoreSelections = (value: unknown): Uint32Array => {
  if (!Array.isArray(value) || value.length % 4 !== 0 || value.some((item) => !Number.isSafeInteger(item) || item < 0 || item > 0xff_ff_ff_ff)) {
    throw new TypeError('Editor selections must be an array of unsigned integer ranges')
  }
  return new Uint32Array(value)
}

const applyComponentState = async (currentState: EditorState, value: unknown): Promise<EditorState> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError('Editor state must be an object')
  }
  const state = value as Record<string, unknown>
  const { cursorUndoStack: jsonCursorUndoStack, lines, selections: jsonSelections } = state
  for (const key of ['uid', 'id', 'uri'] as const) {
    if (state[key] !== currentState[key]) {
      throw new Error(`Editor state ${key} must remain ${currentState[key]}`)
    }
  }
  if (!Array.isArray(lines) || lines.some((line) => typeof line !== 'string')) {
    throw new TypeError('Editor lines must be an array of strings')
  }
  if (jsonCursorUndoStack !== undefined && !Array.isArray(jsonCursorUndoStack)) {
    throw new TypeError('Editor cursorUndoStack must be an array')
  }
  const selections = restoreSelections(jsonSelections)
  const cursorUndoStack = (jsonCursorUndoStack as unknown[] | undefined)?.map(restoreSelections)
  const normalized = { ...state, cursorUndoStack, selections } as unknown as EditorState
  const currentJsonState = GetComponentState.getComponentState(currentState.uid)
  // Keep unchanged collections so a JSON round trip does not invalidate every render cache.
  const entries = Object.entries(normalized).map(([key, entry]) => [
    key,
    JSON.stringify(state[key]) === JSON.stringify(currentJsonState[key]) ? currentState[key as keyof EditorState] : entry,
  ])
  const newState = Object.fromEntries(entries) as unknown as EditorState
  return UpdateDerivedState.updateDerivedState(currentState, newState)
}

export const setComponentState = EditorStates.wrapCommand(applyComponentState)
