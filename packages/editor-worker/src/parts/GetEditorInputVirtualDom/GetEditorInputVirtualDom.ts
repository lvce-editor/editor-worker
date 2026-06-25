import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getEditorInputVirtualDom = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: 'EditorInput',
      type: VirtualDomElements.Div,
    },
    {
      ariaAutoComplete: 'list',
      ariaMultiLine: 'true',
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
      role: 'textbox',
      spellcheck: false,
      type: VirtualDomElements.TextArea,
      wrap: 'off',
    },
  ]
}
