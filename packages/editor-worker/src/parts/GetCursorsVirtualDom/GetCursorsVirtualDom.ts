import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getCursorsVirtualDom = (cursors: any[]) => {
  const dom = []
  for (const translate of cursors) {
    dom.push({
      className: ClassNames.EditorCursor,
      translate,
      type: VirtualDomElements.Div,
    })
  }
  return dom
}
