import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'

export const getFindMatchCountClassName = (matchCount: number, value: string): string => {
  if (value && matchCount === 0) {
    return MergeClassNames.mergeClassNames(ClassNames.FindWidgetMatchCount, ClassNames.FindWidgetMatchCountEmpty)
  }
  return ClassNames.FindWidgetMatchCount
}
