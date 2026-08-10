interface DiagnosticHoverMetadata {
  readonly code?: number | string
  readonly source?: string
}

export const getDiagnosticHoverDetail = ({ code, source }: DiagnosticHoverMetadata): string => {
  if (code === undefined || code === null) {
    return source || ''
  }
  if (!source) {
    return `${code}`
  }
  return `${source} (${code})`
}
