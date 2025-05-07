import { isEqual } from 'lodash'
import type { ApiResponse } from '../../../util/http.helper'
import { isObject } from '../../../util/type-guards'
import { deepCompare } from './object-diff.helper'

export const compareArrays = (ar1: unknown[], ar2: unknown[]) => {
  const remainings1 = [...ar1]
  const remainings2 = [...ar2]
  while (remainings1.length > 0) {
    const item1 = remainings1.shift()
    let diffs: string[] = []
    for (let index2 = 0; index2 < remainings2.length; index2++) {
      const item2 = remainings2[index2]
      diffs = compareValues(item1, item2)
      if (diffs.length === 0) {
        remainings2.splice(index2, 1)
        break
      }
    }
    if (diffs.length) {
      return diffs
    }
  }
  return []
}

export const compareValues = (v1: unknown, v2: unknown): string[] => {
  const diffs: string[] = []
  if (Array.isArray(v1)) {
    if (!Array.isArray(v2)) {
      return [`Value mismatch (non-array): ${v1} !== ${v2}`]
    }
    return compareArrays(v1, v2)
  }
  if (isObject(v1)) {
    if (!isObject(v2)) {
      return [`Value mismatch (non-object): ${v1} !== ${v2}`]
    }
    return deepCompare(v1, v2)
  }
  if (!isEqual(v1, v2)) {
    return [`Value mismatch (non-JSON): ${v1} !== ${v2}`]
  }
  return diffs
}

export const compareResponses = (
  res1: ApiResponse,
  res2: ApiResponse,
): string[] => {
  if (res1.status !== res2.status) {
    return [`Status code mismatch: ${res1.status} vs ${res2.status}`]
  }
  return compareValues(res1.data, res2.data)
}
