export interface CachedLine {
  readonly embeddedLanguageEnd?: number
  readonly embeddedLanguageStart?: number
  readonly embeddedResultIndex?: number
  readonly tokens: readonly number[]
}

export interface CachedViewport {
  readonly embeddedResults: readonly {
    readonly result: CachedLine
    readonly isFull: boolean
    readonly TokenMap: Readonly<Record<string, string>>
  }[]
  readonly tokenizersToLoad: readonly string[]
  readonly tokens: readonly CachedLine[]
}

const magic = 0x53_48_43_31
const maxBytes = 8 * 1024 * 1024

const checksum = (buffer: ArrayBuffer): number => {
  let hash = 0x81_1c_9d_c5
  const bytes = new Uint8Array(buffer)
  for (let i = 0; i < bytes.length; i++) {
    if (i < 12 || i >= 16) {
      hash = Math.imul(hash ^ bytes[i], 0x01_00_01_93) >>> 0
    }
  }
  return hash
}

// Numeric token pairs are stored as uint16/uint32, never as JSON. A small JSON header
// contains only rendering metadata, array lengths and the expiration timestamp.
export const encode = (viewport: CachedViewport, expires: number): ArrayBuffer | undefined => {
  if (viewport.tokenizersToLoad.length > 0) {
    return undefined
  }
  const arrays: number[][] = []
  const project = (line: CachedLine) => {
    const tokens = [...line.tokens]
    if (tokens.length % 2 || tokens.some((value) => !Number.isSafeInteger(value) || value < 0 || value > 0xff_ff_ff_ff)) {
      throw new Error('Invalid token array')
    }
    arrays.push(tokens)
    return {
      length: tokens.length,
      ...(line.embeddedLanguageStart !== undefined && { embeddedLanguageStart: line.embeddedLanguageStart }),
      ...(line.embeddedLanguageEnd !== undefined && { embeddedLanguageEnd: line.embeddedLanguageEnd }),
      ...(line.embeddedResultIndex !== undefined && { embeddedResultIndex: line.embeddedResultIndex }),
    }
  }
  const tokens = viewport.tokens.map(project)
  const embeddedResults = viewport.embeddedResults.map((entry) => ({ ...entry, result: project(entry.result) }))
  const width = arrays.every((array) => array.every((value) => value <= 0xff_ff)) ? 2 : 4
  const header = new TextEncoder().encode(JSON.stringify({ embeddedResults, expires, tokens, width }))
  const offset = Math.ceil((16 + header.length) / 4) * 4
  const totalLength = arrays.reduce((total, array) => total + array.length, 0)
  if (offset + totalLength * width > maxBytes) {
    return undefined
  }
  const buffer = new ArrayBuffer(offset + totalLength * width)
  const view = new DataView(buffer)
  view.setUint32(0, magic, true)
  view.setUint32(4, header.length, true)
  view.setUint32(8, totalLength, true)
  new Uint8Array(buffer, 16, header.length).set(header)
  let index = offset
  for (const array of arrays) {
    for (const value of array) {
      if (width === 2) {
        view.setUint16(index, value, true)
      } else {
        view.setUint32(index, value, true)
      }
      index += width
    }
  }
  view.setUint32(12, checksum(buffer), true)
  return buffer
}

export const decode = (buffer: ArrayBuffer, lineLengths: readonly number[], now: number): CachedViewport | undefined => {
  try {
    if (buffer.byteLength < 16 || buffer.byteLength > maxBytes) {
      return undefined
    }
    const view = new DataView(buffer)
    if (view.getUint32(0, true) !== magic || view.getUint32(12, true) !== checksum(buffer)) {
      return undefined
    }
    const headerLength = view.getUint32(4, true)
    let offset = Math.ceil((16 + headerLength) / 4) * 4
    const header = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(new Uint8Array(buffer, 16, headerLength)))
    const { width } = header
    if ((width !== 2 && width !== 4) || offset + view.getUint32(8, true) * width !== buffer.byteLength) {
      return undefined
    }
    if (!Number.isFinite(header.expires) || header.expires <= now || header.expires > now + 90 * 24 * 60 * 60 * 1000) {
      return undefined
    }
    const readLine = (line: any): CachedLine => {
      const tokenCount: number = line.length
      if (!Number.isSafeInteger(tokenCount) || tokenCount < 0 || tokenCount % 2 || offset + tokenCount * width > buffer.byteLength) {
        throw new Error('Invalid token count')
      }
      const tokens: number[] = []
      for (let i = 0; i < tokenCount; i++) {
        tokens.push(width === 2 ? view.getUint16(offset, true) : view.getUint32(offset, true))
        offset += width
      }
      for (const name of ['embeddedLanguageStart', 'embeddedLanguageEnd', 'embeddedResultIndex']) {
        if (line[name] !== undefined && (!Number.isSafeInteger(line[name]) || line[name] < 0)) {
          throw new Error('Invalid embedded metadata')
        }
      }
      return {
        tokens,
        ...(line.embeddedLanguageStart !== undefined && { embeddedLanguageStart: line.embeddedLanguageStart }),
        ...(line.embeddedLanguageEnd !== undefined && { embeddedLanguageEnd: line.embeddedLanguageEnd }),
        ...(line.embeddedResultIndex !== undefined && { embeddedResultIndex: line.embeddedResultIndex }),
      }
    }
    if (!Array.isArray(header.tokens) || header.tokens.length !== lineLengths.length || !Array.isArray(header.embeddedResults)) {
      return undefined
    }
    const tokens = header.tokens.map(readLine)
    const embeddedResults = header.embeddedResults.map((entry: any) => {
      if (
        typeof entry.isFull !== 'boolean' ||
        !entry.TokenMap ||
        typeof entry.TokenMap !== 'object' ||
        Object.values(entry.TokenMap).some((value) => typeof value !== 'string')
      ) {
        throw new Error('Invalid embedded token map')
      }
      return { isFull: entry.isFull, result: readLine(entry.result), TokenMap: entry.TokenMap }
    })
    for (let i = 0; i < tokens.length; i++) {
      const line = tokens[i]
      const total = line.tokens.reduce((sum: number, value: number, index: number) => sum + (index % 2 ? value : 0), 0)
      if (total !== lineLengths[i]) {
        return undefined
      }
      if (
        line.embeddedResultIndex !== undefined &&
        (!embeddedResults[line.embeddedResultIndex] ||
          line.embeddedLanguageStart === undefined ||
          line.embeddedLanguageEnd === undefined ||
          line.embeddedLanguageStart > lineLengths[i] ||
          (line.embeddedLanguageStart > line.embeddedLanguageEnd &&
            (embeddedResults[line.embeddedResultIndex].isFull || embeddedResults[line.embeddedResultIndex].result.tokens.length > 0)) ||
          line.embeddedLanguageEnd > lineLengths[i])
      ) {
        return undefined
      }
    }
    if (offset !== buffer.byteLength) {
      return undefined
    }
    return { embeddedResults, tokenizersToLoad: [], tokens }
  } catch {
    return undefined
  }
}
