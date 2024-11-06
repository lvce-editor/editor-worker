import * as DiagnosticType from '../DiagnosticType/DiagnosticType.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getDiagnosticClassName = (type: string): string => {
  switch (type) {
    case DiagnosticType.Error:
      return ClassNames.DiagnosticError
    case DiagnosticType.Warning:
      return ClassNames.DiagnosticWarning
    default:
      return ClassNames.DiagnosticError
  }
}
