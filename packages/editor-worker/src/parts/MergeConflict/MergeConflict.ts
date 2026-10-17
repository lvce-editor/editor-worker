export interface MergeConflict {
  readonly baseEndRowIndex: number
  readonly baseStartRowIndex: number
  readonly currentEndRowIndex: number
  readonly currentStartRowIndex: number
  readonly endRowIndex: number
  readonly incomingEndRowIndex: number
  readonly incomingStartRowIndex: number
  readonly separatorRowIndex: number
  readonly startRowIndex: number
}
