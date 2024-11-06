import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetDiagnosticClassName from '../GetDiagnosticClassName/GetDiagnosticClassName.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getDiagnosticVirtualDom = (diagnostic: any) => {
  const { x, y, width, height, type } = diagnostic
  const extraClassName = GetDiagnosticClassName.getDiagnosticClassName(type)
  return [
    {
      type: VirtualDomElements.Div,
      className: MergeClassNames.mergeClassNames(ClassNames.Diagnostic, extraClassName),
      width,
      height,
      top: y,
      left: x,
      childCount: 0,
    },
  ]
}
