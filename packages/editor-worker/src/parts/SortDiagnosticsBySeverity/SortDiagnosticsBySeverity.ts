export const sortDiagnosticsBySeverity = <T extends { readonly type: string }>(diagnostics: readonly T[]): T[] => {
  return diagnostics.toSorted((left, right) => {
    if (left.type === right.type) {
      return 0
    }
    if (left.type === 'warning') {
      return -1
    }
    if (right.type === 'warning') {
      return 1
    }
    return 0
  })
}
