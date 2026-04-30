export interface EvaluationPreview {
  readonly rowIndex: number
  readonly value: string
}

import * as TransformSource from '../TransformSource/TransformSource.ts'

const truncate = (value: string, maxLength = 120): string => {
  if (value.length <= maxLength) {
    return value
  }
  return `${value.slice(0, maxLength - 3)}...`
}

const stringifyValue = (value: unknown): string => {
  if (typeof value === 'string') {
    return truncate(JSON.stringify(value))
  }
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint' || value === undefined) {
    return String(value)
  }
  if (typeof value === 'symbol') {
    return truncate(String(value))
  }
  if (typeof value === 'function') {
    return '[Function]'
  }
  if (value === null) {
    return 'null'
  }
  try {
    return truncate(JSON.stringify(value))
  } catch {
    return truncate(Object.prototype.toString.call(value))
  }
}

export const evaluateText = async (text: string): Promise<readonly EvaluationPreview[]> => {
  const { code, markerLines } = TransformSource.transformSource(text)
  if (markerLines.length === 0) {
    return []
  }
  if (!code) {
    return []
  }
  const previewMap = new Map<number, string>()
  const preview = (rowIndex: number, value: unknown): unknown => {
    previewMap.set(rowIndex, stringifyValue(value))
    return value
  }
  try {
    // The evaluation worker runs transformed user-authored source in an isolated worker scope
    // to compute inline previews for `//?` markers.
    // eslint-disable-next-line @typescript-eslint/no-implied-eval, sonarjs/code-eval
    const fn = new Function('__preview__', `'use strict'\n${code}`)
    fn(preview)
  } catch {
    return []
  }
  return markerLines.flatMap((rowIndex) => {
    const value = previewMap.get(rowIndex)
    if (value === undefined) {
      return []
    }
    return [
      {
        rowIndex,
        value,
      },
    ]
  })
}
