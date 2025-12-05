import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetSearchFieldButtonVirtualDom from '../GetSearchFieldButtonVirtualDom/GetSearchFieldButtonVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getSearchFieldVirtualDom = (
  name: string,
  placeholder: string,
  onInput: string,
  insideButtons: any,
  outsideButtons: any,
  onFocus = '',
) => {
  const dom = [
    {
      childCount: 2,
      className: ClassNames.SearchField,
      role: AriaRoles.None,
      type: VirtualDomElements.Div,
    },
    {
      autocapitalize: 'off',
      autocorrect: 'off',
      childCount: 0,
      className: ClassNames.MultilineInputBox,
      name,
      onFocus,
      onInput,
      placeholder,
      spellcheck: false,
      type: VirtualDomElements.TextArea,
    },
    {
      childCount: insideButtons.length,
      className: ClassNames.SearchFieldButtons,
      type: VirtualDomElements.Div,
    },
    ...insideButtons.flatMap(GetSearchFieldButtonVirtualDom.getSearchFieldButtonVirtualDom),
  ]
  if (outsideButtons.length > 0) {
    throw new Error('outsideButtons are deprecated')
  }
  return dom
}
