import * as DiagnosticType from '../DiagnosticType/DiagnosticType.ts'

export const getDiagnosticClassName = (type: any): string => {
  // TODO use classnames enum
  switch (type) {
    case DiagnosticType.Error:
      return 'DiagnosticError'
    case DiagnosticType.Warning:
      return 'DiagnosticWarning'
    default:
      return 'DiagnosticError'
  }
}
