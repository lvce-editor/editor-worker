interface DiagnosticHoverMetadata {
  readonly code?: number | string
  readonly source?: string
}

export const getDiagnosticHoverDetail = ({ code, source }: DiagnosticHoverMetadata): string => {
  if (code === undefined) {
    return source || ''
  }
  if (!source) {
    return String(code)
  }
  return `${source} (${code})`
}
