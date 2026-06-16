import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getCursorsVirtualDom = (cursors: any[]) => {
  const dom = Array.from(cursors, translate => ({
      childCount: 0,
      className: ClassNames.EditorCursor,
      translate,
      type: VirtualDomElements.Div,
    }));
  return dom
}
