import * as DefinitionLinkDecoration from '../DefinitionLinkDecoration/DefinitionLinkDecoration.ts'
import * as EditorHoverState from '../EditorHoverState/EditorHoverState.ts'
import * as EditorCommandHandleMouseMoveWithAltKey from './EditorCommandHandleMouseMoveWithAltKey.ts'
import * as EditorPosition from './EditorCommandPosition.ts'

const showHover = async (editor: any, position: any) => {
  // TODO race condition
  // await Viewlet.closeWidget(ViewletModuleId.EditorHover)
  // await Viewlet.openWidget(ViewletModuleId.EditorHover, position)
}

// TODO several things can happen:
// 1. highlight link when alt key is pressed
// 2. show hover info
// 3. selection moves
// 4. highlight go to definition
// 5. show color picker
// 6. show error info

const onHoverIdle = async () => {
  const { editor, x, y } = EditorHoverState.get()
  const position = await EditorPosition.at(editor, x, y)
  await showHover(editor, position)
}

const hoverDelay = 300

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
  const timeout = setTimeout(onHoverIdle, hoverDelay)
  EditorHoverState.set(editorWithoutDefinitionLink, timeout, x, y)
  return editorWithoutDefinitionLink
}
