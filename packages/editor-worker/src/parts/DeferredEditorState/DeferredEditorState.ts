import type { EditorState } from '../State/State.ts'

// Diagnostic updates and undo grouping preserve the document, selection, layout, widgets and lifecycle.
const independentFields = new Set(['canCoalesceTyping', 'decorations', 'diagnostics', 'lightBulbRowIndex', 'visualDecorations'])

export const isCurrent = (snapshot: EditorState, current: EditorState | undefined): boolean => {
  if (!current || current.lifecycle?.disposed) {
    return false
  }
  if (snapshot === current) {
    return true
  }
  const keys = new Set([...Object.keys(snapshot), ...Object.keys(current)])
  for (const key of keys) {
    if (independentFields.has(key)) {
      continue
    }

    const field = key as keyof EditorState
    if (Object.hasOwn(snapshot, field) !== Object.hasOwn(current, field) || snapshot[field] !== current[field]) {
      return false
    }
  }
  return true
}

export const merge = (current: EditorState, snapshot: EditorState, result: EditorState): EditorState => {
  if (!isCurrent(snapshot, current) || result === snapshot || result === current) {
    return current
  }
  if (current === snapshot) {
    return result
  }
  return {
    ...result,
    canCoalesceTyping: current.canCoalesceTyping,
    decorations: current.decorations,
    diagnostics: current.diagnostics,
    lightBulbRowIndex: current.lightBulbRowIndex,
    visualDecorations: current.visualDecorations,
  }
}
