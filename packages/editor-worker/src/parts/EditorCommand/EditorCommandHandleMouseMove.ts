import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as DefinitionLinkDecoration from '../DefinitionLinkDecoration/DefinitionLinkDecoration.ts'
import * as EditorHoverState from '../EditorHoverState/EditorHoverState.ts'
import * as Editors from '../EditorStates/EditorStates.ts'
import * as Id from '../Id/Id.ts'
import * as EditorCommandHandleMouseMoveWithAltKey from './EditorCommandHandleMouseMoveWithAltKey.ts'
import * as EditorPosition from './EditorCommandPosition.ts'
import * as EditorCommandShowHover from './EditorCommandShowHover.ts'

const showHover = async (editor: any, position: any, token: number) => {
  const instance = Editors.get(editor.uid)
  if (!instance) {
    return
  }
  const latestEditor = instance.newState
  const newEditor = await EditorCommandShowHover.showHover(latestEditor, position)
  const latestInstance = Editors.get(editor.uid)
  if (latestEditor === newEditor || !latestInstance || latestInstance.newState !== latestEditor || EditorHoverState.get().token !== token) {
    return
  }
  Editors.set(editor.uid, latestInstance.oldState, newEditor)
  await RendererWorker.invoke('Editor.renderPending', editor.uid)
}

// TODO several things can happen:
// 1. highlight link when alt key is pressed
// 2. show hover info
// 3. selection moves
// 4. highlight go to definition
// 5. show color picker
// 6. show error info

const onHoverIdle = async (token: number) => {
  try {
    const { editor, token: latestToken, x, y } = EditorHoverState.get()
    if (latestToken !== token) {
      return
    }
    const position = await EditorPosition.at(editor, x, y)
    await showHover(editor, position, token)
  } catch {
    // Hover providers are optional and should not surface errors from an idle mouse event.
  }
}

const hoverDelay = 200

export const handleMouseMove = async (editor: any, x: number, y: number, altKey: boolean) => {
  if (altKey) {
    return EditorCommandHandleMouseMoveWithAltKey.handleMouseMoveWithAltKey(editor, x, y)
  }
  const editorWithoutDefinitionLink = DefinitionLinkDecoration.clear(editor)
  if (!editorWithoutDefinitionLink.hoverEnabled) {
    return editorWithoutDefinitionLink
  }
  const oldState = EditorHoverState.get()
  if (oldState.timeout !== -1) {
    clearTimeout(oldState.timeout)
  }
  const token = Id.create()
  const timeout = setTimeout(onHoverIdle, hoverDelay, token)
  EditorHoverState.set(editorWithoutDefinitionLink, timeout, x, y, token)
  return editorWithoutDefinitionLink
}
