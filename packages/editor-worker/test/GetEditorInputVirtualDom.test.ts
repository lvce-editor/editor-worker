import { expect, test } from '@jest/globals'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetEditorInputVirtualDom from '../src/parts/GetEditorInputVirtualDom/GetEditorInputVirtualDom.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

test('getEditorInputVirtualDom', () => {
  expect(GetEditorInputVirtualDom.getEditorInputVirtualDom()).toEqual([
    {
      ariaAutoComplete: 'list',
      ariaMultiLine: 'true',
      ariaRoleDescription: 'editor',
      autocapitalize: 'off',
      autocomplete: 'off',
      autocorrect: 'off',
      childCount: 0,
      className: 'EditorInput',
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
  ])
})
