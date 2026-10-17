import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as AriaBoolean from '../AriaBoolean/AriaBoolean.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

const editorInputNode: VirtualDomNode = {
  childCount: 1,
  className: 'EditorInput',
  type: VirtualDomElements.Div,
}

const editorTextAreaNode: VirtualDomNode = {
  ariaAutoComplete: 'list',
  ariaMultiLine: AriaBoolean.True,
  ariaRoleDescription: 'editor',
  autocapitalize: 'off',
  autocomplete: 'off',
  autocorrect: 'off',
  childCount: 0,
  name: 'editor',
  onBeforeInput: DomEventListenerFunctions.HandleBeforeInput,
  onBlur: DomEventListenerFunctions.HandleBlur,
  onCompositionEnd: DomEventListenerFunctions.HandleCompositionEnd,
  onCompositionStart: DomEventListenerFunctions.HandleCompositionStart,
  onCompositionUpdate: DomEventListenerFunctions.HandleCompositionUpdate,
  onCut: DomEventListenerFunctions.HandleCut,
  onFocus: DomEventListenerFunctions.HandleFocus,
  onPaste: DomEventListenerFunctions.HandlePaste,
  role: AriaRoles.TextBox,
  spellcheck: false,
  type: VirtualDomElements.TextArea,
  wrap: 'off',
}

export const getEditorInputVirtualDom = (): readonly VirtualDomNode[] => {
  return [editorInputNode, editorTextAreaNode]
}
