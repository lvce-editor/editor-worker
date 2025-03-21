import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getCursorsVirtualDom = (cursors: any[]) => {
  const dom = []
  for (const translate of cursors) {
    dom.push({
      type: VirtualDomElements.Div,
      className: ClassNames.EditorCursor,
      translate,
    })
  }
  return dom
}
