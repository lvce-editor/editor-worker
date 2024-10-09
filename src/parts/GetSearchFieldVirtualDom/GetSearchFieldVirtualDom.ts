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
  onFocus = ''
) => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.SearchField,
      role: AriaRoles.None,
      childCount: 2,
    },
    {
      type: VirtualDomElements.TextArea,
      className: ClassNames.MultilineInputBox,
      spellcheck: false,
      autocapitalize: 'off',
      autocorrect: 'off',
      placeholder,
      name,
      onInput,
      onFocus,
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.SearchFieldButtons,
      childCount: insideButtons.length,
    },
    ...insideButtons.flatMap(GetSearchFieldButtonVirtualDom.getSearchFieldButtonVirtualDom),
  ]
  if (outsideButtons.length > 0) {
    dom.unshift({
      type: VirtualDomElements.Div,
      className: ClassNames.SearchFieldContainer,
      role: AriaRoles.None,
      childCount: 1 + outsideButtons.length,
    })
    dom.push(...outsideButtons.flatMap(GetSearchFieldButtonVirtualDom.getSearchFieldButtonVirtualDom))
  }
  return dom
}
