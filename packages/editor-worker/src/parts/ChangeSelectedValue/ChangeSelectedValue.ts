import * as Editor from '../Editor/Editor.ts'

const colorPattern = /#[\dA-Fa-f]+/g
const numberPattern = /(?<![\w.#])[+-]?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:[eE][+-]?\d+)?(?![\d.])/g
const validColorLengths = new Set([4, 5, 7, 9])

interface ValueRange {
  readonly end: number
  readonly start: number
  readonly value: string
}

interface SelectionTarget extends ValueRange {
  readonly activeOffset: number | undefined
  readonly index: number
  readonly rowIndex: number
  readonly selectionEnd: number
  readonly selectionStart: number
}

const isColor = (value: string): boolean => {
  return validColorLengths.has(value.length) && /^#[\dA-Fa-f]+$/.test(value)
}

const isNumber = (value: string): boolean => {
  return /^[+-]?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:[eE][+-]?\d+)?$/.test(value)
}

const adjustNumber = (value: string, delta: number): string => {
  const match = /^([+-]?)(?:(\d+)(?:\.(\d*))?|\.(\d+))([eE][+-]?\d+)?$/.exec(value)
  if (!match) {
    return value
  }
  const [, originalSign, integerPart = '', fractionAfterInteger, fractionWithoutInteger, exponent = ''] = match
  const fraction = fractionAfterInteger ?? fractionWithoutInteger ?? ''
  const mantissaEnd = exponent ? value.length - exponent.length : value.length
  const hadDecimalPoint = value.slice(0, mantissaEnd).includes('.')
  const scale = fraction.length
  const unsignedUnits = BigInt(`${integerPart || '0'}${fraction}`)
  const signedUnits = originalSign === '-' ? -unsignedUnits : unsignedUnits
  const nextUnits = signedUnits + BigInt(delta)
  const isNegative = nextUnits < 0
  const absoluteUnits = isNegative ? -nextUnits : nextUnits
  const minimumIntegerLength = Math.max(integerPart.length, 1)
  const digits = absoluteUnits.toString().padStart(scale + minimumIntegerLength, '0')
  const resultInteger = scale === 0 ? digits : digits.slice(0, -scale)
  const resultFraction = scale === 0 ? '' : digits.slice(-scale)
  const omitLeadingZero = integerPart === '' && resultInteger === '0'
  const mantissa = `${omitLeadingZero ? '' : resultInteger}${hadDecimalPoint ? '.' : ''}${resultFraction}`
  const sign = isNegative ? '-' : originalSign === '+' ? '+' : ''
  return `${sign}${mantissa}${exponent}`
}

const adjustColorComponent = (digits: string, componentIndex: number, componentWidth: number, delta: number, uppercase: boolean): string => {
  const start = componentIndex * componentWidth
  const value = Number.parseInt(digits.slice(start, start + componentWidth), 16)
  const maximum = componentWidth === 1 ? 0xf : 0xff
  const nextValue = Math.max(0, Math.min(maximum, value + delta))
  const replacement = nextValue.toString(16).padStart(componentWidth, '0')
  return `${digits.slice(0, start)}${uppercase ? replacement.toUpperCase() : replacement}${digits.slice(start + componentWidth)}`
}

const adjustColor = (value: string, delta: number, activeOffset: number | undefined): string => {
  const digits = value.slice(1)
  const componentWidth = digits.length <= 4 ? 1 : 2
  const componentCount = digits.length / componentWidth
  const uppercase = /[A-F]/.test(digits) && !/[a-f]/.test(digits)
  if (activeOffset !== undefined && activeOffset > 0) {
    const digitOffset = Math.min(activeOffset - 1, digits.length - 1)
    const componentIndex = Math.floor(digitOffset / componentWidth)
    return `#${adjustColorComponent(digits, componentIndex, componentWidth, delta, uppercase)}`
  }
  let adjusted = digits
  for (let componentIndex = 0; componentIndex < Math.min(componentCount, 3); componentIndex++) {
    adjusted = adjustColorComponent(adjusted, componentIndex, componentWidth, delta, uppercase)
  }
  return `#${adjusted}`
}

export const changeValue = (value: string, delta: number, activeOffset: number | undefined = undefined): string => {
  if (isColor(value)) {
    return adjustColor(value, delta, activeOffset)
  }
  if (isNumber(value)) {
    return adjustNumber(value, delta)
  }
  return value
}

const findMatchAt = (line: string, columnIndex: number, pattern: RegExp, predicate: (value: string) => boolean): ValueRange | undefined => {
  pattern.lastIndex = 0
  for (const match of line.matchAll(pattern)) {
    const value = match[0]
    const start = match.index
    const end = start + value.length
    if (predicate(value) && columnIndex >= start && columnIndex <= end) {
      return { end, start, value }
    }
  }
  return undefined
}

export const findValueAt = (line: string, columnIndex: number): ValueRange | undefined => {
  return findMatchAt(line, columnIndex, colorPattern, isColor) ?? findMatchAt(line, columnIndex, numberPattern, isNumber)
}

const getSelectionTarget = (editor: any, index: number): SelectionTarget | undefined => {
  const selectionStartRow = editor.selections[index]
  const selectionStartColumn = editor.selections[index + 1]
  const selectionEndRow = editor.selections[index + 2]
  if (selectionStartRow !== selectionEndRow) {
    return undefined
  }
  const selectionEndColumn = editor.selections[index + 3]
  const rowIndex = selectionStartRow
  const line = editor.lines[rowIndex]
  const start = Math.min(selectionStartColumn, selectionEndColumn)
  const end = Math.max(selectionStartColumn, selectionEndColumn)
  if (start !== end) {
    const value = line.slice(start, end)
    if (!isColor(value) && !isNumber(value)) {
      return undefined
    }
    return {
      activeOffset: undefined,
      end,
      index,
      rowIndex,
      selectionEnd: selectionEndColumn,
      selectionStart: selectionStartColumn,
      start,
      value,
    }
  }
  const range = findValueAt(line, selectionEndColumn)
  if (!range) {
    return undefined
  }
  return {
    ...range,
    activeOffset: selectionEndColumn - range.start,
    index,
    rowIndex,
    selectionEnd: selectionEndColumn,
    selectionStart: selectionStartColumn,
  }
}

const getTargets = (editor: any): readonly SelectionTarget[] => {
  const targets: SelectionTarget[] = []
  for (let index = 0; index < editor.selections.length; index += 4) {
    const target = getSelectionTarget(editor, index)
    if (target) {
      targets.push(target)
    }
  }
  return targets
}

const getUniqueTargets = (targets: readonly SelectionTarget[]): readonly SelectionTarget[] => {
  const seen = new Set<string>()
  return targets
    .filter((target) => {
      const key = `${target.rowIndex}:${target.start}:${target.end}`
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
    .toSorted((a, b) => a.rowIndex - b.rowIndex || a.start - b.start)
}

const getColumnDeltaBefore = (
  targets: readonly SelectionTarget[],
  replacements: ReadonlyMap<SelectionTarget, string>,
  rowIndex: number,
  column: number,
) => {
  let delta = 0
  for (const target of targets) {
    if (target.rowIndex !== rowIndex || target.end > column) {
      continue
    }
    delta += replacements.get(target)!.length - target.value.length
  }
  return delta
}

const mapColumn = (
  targets: readonly SelectionTarget[],
  replacements: ReadonlyMap<SelectionTarget, string>,
  rowIndex: number,
  column: number,
): number => {
  for (const target of targets) {
    if (target.rowIndex === rowIndex && column > target.start && column < target.end) {
      const replacement = replacements.get(target)!
      return target.start + getColumnDeltaBefore(targets, replacements, rowIndex, target.start) + Math.min(column - target.start, replacement.length)
    }
  }
  return column + getColumnDeltaBefore(targets, replacements, rowIndex, column)
}

const getNewSelections = (
  editor: any,
  targets: readonly SelectionTarget[],
  uniqueTargets: readonly SelectionTarget[],
  replacements: ReadonlyMap<SelectionTarget, string>,
): Uint32Array => {
  const newSelections = new Uint32Array(editor.selections)
  const targetByIndex = new Map(targets.map((target) => [target.index, target]))
  for (let index = 0; index < editor.selections.length; index += 4) {
    const startRow = editor.selections[index]
    const startColumn = editor.selections[index + 1]
    const endRow = editor.selections[index + 2]
    const endColumn = editor.selections[index + 3]
    const target = targetByIndex.get(index)
    if (!target) {
      newSelections[index + 1] = mapColumn(uniqueTargets, replacements, startRow, startColumn)
      newSelections[index + 3] = mapColumn(uniqueTargets, replacements, endRow, endColumn)
      continue
    }
    const matchingTarget = uniqueTargets.find(
      (candidate) => candidate.rowIndex === target.rowIndex && candidate.start === target.start && candidate.end === target.end,
    )!
    const replacement = replacements.get(matchingTarget)!
    const newStart = target.start + getColumnDeltaBefore(uniqueTargets, replacements, target.rowIndex, target.start)
    const newEnd = newStart + replacement.length
    if (target.selectionStart === target.selectionEnd) {
      const originalOffset = target.selectionEnd - target.start
      const newOffset = originalOffset === target.value.length ? replacement.length : Math.min(originalOffset, replacement.length)
      newSelections[index + 1] = newStart + newOffset
      newSelections[index + 3] = newStart + newOffset
    } else if (target.selectionStart < target.selectionEnd) {
      newSelections[index + 1] = newStart
      newSelections[index + 3] = newEnd
    } else {
      newSelections[index + 1] = newEnd
      newSelections[index + 3] = newStart
    }
  }
  return newSelections
}

export const changeSelectedValue = async (editor: any, delta: number): Promise<any> => {
  const targets = getTargets(editor)
  const uniqueTargets = getUniqueTargets(targets)
  if (uniqueTargets.length === 0) {
    return editor
  }
  const replacements = new Map(
    uniqueTargets.map((target) => [target, changeValue(target.value, delta, targets.find((candidate) => candidate === target)?.activeOffset)]),
  )
  const changedTargets = uniqueTargets.filter((target) => replacements.get(target) !== target.value)
  if (changedTargets.length === 0) {
    return editor
  }
  const changedTargetKeys = new Set(changedTargets.map((target) => `${target.rowIndex}:${target.start}:${target.end}`))
  const selectionTargetsWithChanges = targets.filter((target) => changedTargetKeys.has(`${target.rowIndex}:${target.start}:${target.end}`))
  const changes: any[] = []
  const rowDeltas = new Map<number, number>()
  for (const target of changedTargets) {
    const columnDelta = rowDeltas.get(target.rowIndex) ?? 0
    const startColumn = target.start + columnDelta
    const endColumn = target.end + columnDelta
    const replacement = replacements.get(target)!
    changes.push({
      deleted: [target.value],
      end: { columnIndex: endColumn, rowIndex: target.rowIndex },
      inserted: [replacement],
      origin: 'changeSelectedValue',
      start: { columnIndex: startColumn, rowIndex: target.rowIndex },
    })
    rowDeltas.set(target.rowIndex, columnDelta + replacement.length - target.value.length)
  }
  const newSelections = getNewSelections(editor, selectionTargetsWithChanges, changedTargets, replacements)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes, newSelections)
}
