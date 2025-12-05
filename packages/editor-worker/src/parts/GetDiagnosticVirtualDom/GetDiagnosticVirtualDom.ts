import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetDiagnosticClassName from '../GetDiagnosticClassName/GetDiagnosticClassName.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getDiagnosticVirtualDom = (diagnostic: any) => {
  const { height, type, width, x, y } = diagnostic
  const extraClassName = GetDiagnosticClassName.getDiagnosticClassName(type)
  return [
    {
      childCount: 0,
      className: MergeClassNames.mergeClassNames(ClassNames.Diagnostic, extraClassName),
      height,
      left: x,
      top: y,
      type: VirtualDomElements.Div,
      width,
    },
  ]
}
