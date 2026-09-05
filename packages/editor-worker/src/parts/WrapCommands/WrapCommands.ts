import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { EditorState } from '../State/State.ts'
import * as AutoSave from '../AutoSave/AutoSave.ts'
import * as EditorCommandSave from '../EditorCommand/EditorCommandSave.ts'
import { isUntitledFile } from '../EditorCommand/EditorCommandSave/isUntitledFile.ts'
import * as EditorCommandQueue from '../EditorCommandQueue/EditorCommandQueue.ts'
import { editorDiagnosticEffect } from '../EditorDiagnosticEffect/EditorDiagnosticEffect.ts'
import * as Editors from '../EditorStates/EditorStates.ts'
import { emptyIncrementalEdits } from '../EmptyIncrementalEdits/EmptyIncrementalEdits.ts'
import { notifyEditorStatusChange } from '../NotifyEditorStatusChange/NotifyEditorStatusChange.ts'
import * as Preferences from '../Preferences/Preferences.ts'
import * as UpdateDerivedState from '../UpdateDerivedState/UpdateDerivedState.ts'

const cursorUndoLimit = 100

const selectionsEqual = (left: Uint32Array, right: Uint32Array): boolean => {
  if (left === right) {
    return true
  }
  if (left.length !== right.length) {
    return false
  }
  for (let i = 0; i < left.length; i++) {
    if (left[i] !== right[i]) {
      return false
    }
  }
  return true
}

const saveAfterDelay = async (uid: number, token: number): Promise<void> => {
  if (!Editors.get(uid)) {
    AutoSave.consume(uid, token)
    return
  }
  let didSave = false
  const save = wrapCommand(async (editor: EditorState) => {
    if (!AutoSave.isLatest(uid, token)) {
      return editor
    }
    AutoSave.consume(uid, token)
    const autoSave = await Preferences.get('files.autoSave')
    if (autoSave !== 'afterDelay') {
      return editor
    }
    const savedEditor = await EditorCommandSave.save(editor)
    didSave = savedEditor !== editor
    return savedEditor
  })
  await save(uid)
  if (didSave) {
    await RendererWorker.invoke('Editor.renderPending', uid)
  }
}

// TODO wrap commands globally, not per editor
// TODO only store editor state in editor worker, not in renderer worker also

export const wrapCommand =
  (fn: any, preservesTypingCoalescing = false) =>
  async (uid: number, ...args: any[]) => {
    return EditorCommandQueue.enqueue(uid, async () => {
      const oldInstance = Editors.get(uid)
      if (!oldInstance) {
        return undefined
      }
      const state = oldInstance.newState
      const { cursorUndoStack, endOfLine, initial, insertSpaces, isSelecting, lines, modified, redoStack, selections, undoStack, uri } = state
      const commandResult = await fn(state, ...args)
      let newEditor = !preservesTypingCoalescing && commandResult.canCoalesceTyping ? { ...commandResult, canCoalesceTyping: false } : commandResult
      if (lines !== newEditor.lines && newEditor.cursorUndoStack?.length) {
        newEditor = { ...newEditor, cursorUndoStack: [] }
      } else if (
        selections &&
        newEditor.selections &&
        !isSelecting &&
        newEditor.cursorUndoStack === cursorUndoStack &&
        (!selectionsEqual(selections, newEditor.selections) || newEditor.isSelecting)
      ) {
        const previousCursorUndoStack = cursorUndoStack || []
        newEditor = {
          ...newEditor,
          cursorUndoStack: [...previousCursorUndoStack.slice(1 - cursorUndoLimit), new Uint32Array(selections)],
        }
      }
      if (state === newEditor) {
        return newEditor
      }
      const newEditorWithDerivedState = await UpdateDerivedState.updateDerivedState(state, newEditor)
      Editors.set(uid, state, newEditorWithDerivedState)
      if (editorDiagnosticEffect.isActive(state, newEditorWithDerivedState)) {
        void editorDiagnosticEffect.apply(newEditorWithDerivedState)
      }
      const finalEditor = newEditorWithDerivedState
      await notifyEditorStatusChange(state, finalEditor)
      if (
        !initial &&
        uri === finalEditor.uri &&
        (endOfLine !== finalEditor.endOfLine ||
          insertSpaces !== finalEditor.insertSpaces ||
          lines !== finalEditor.lines ||
          modified !== finalEditor.modified ||
          redoStack !== finalEditor.redoStack ||
          undoStack !== finalEditor.undoStack)
      ) {
        for (const key of Editors.getKeys()) {
          const otherUid = Number(key)
          const instance = Editors.get(otherUid)
          const editor = instance?.newState
          if (
            otherUid === uid ||
            !instance ||
            !editor ||
            editor.initial ||
            editor.uri !== finalEditor.uri ||
            editor.applicationId !== finalEditor.applicationId
          ) {
            continue
          }
          const synchronizedEditor = await UpdateDerivedState.updateDerivedState(editor, {
            ...editor,
            decorations: finalEditor.decorations,
            diagnostics: finalEditor.diagnostics,
            endOfLine: finalEditor.endOfLine,
            incrementalEdits: emptyIncrementalEdits,
            insertSpaces: finalEditor.insertSpaces,
            invalidStartIndex: Math.min(editor.invalidStartIndex, finalEditor.invalidStartIndex),
            lines: finalEditor.lines,
            modified: finalEditor.modified,
            redoStack: finalEditor.redoStack,
            undoStack: finalEditor.undoStack,
            visualDecorations: finalEditor.visualDecorations,
          })
          Editors.set(otherUid, instance.oldState, synchronizedEditor)
        }
      }
      if (lines !== finalEditor.lines && !isUntitledFile(finalEditor.uri)) {
        AutoSave.schedule(uid, (token) => saveAfterDelay(uid, token))
      } else if (modified && !finalEditor.modified) {
        AutoSave.dispose(uid)
      }
      return finalEditor
    })
  }
