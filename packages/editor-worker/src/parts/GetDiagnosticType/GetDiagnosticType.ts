import type { Diagnostic } from '../Diagnostic/Diagnostic.ts'

export const getDiagnosticType = (diagnostic: Diagnostic): string => {
  return diagnostic.type
}
