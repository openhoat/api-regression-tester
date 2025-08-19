import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { isEqual } from 'lodash'
import { isObject } from '../../../util/type-guards'

dayjs.extend(customParseFormat)

const { VERBOSE } = process.env
const verbose = VERBOSE === 'true'

export interface DiffConfig {
  ignoreKeys: string[]
  numericTolerance: number
  transformations?: {
    fromKey: string
    toKey: string
    toValue: (value: unknown) => unknown
  }[]
}

const transformations: DiffConfig['transformations'] = [
  {
    fromKey: 'createdAt',
    toKey: 'date',
    toValue: (value: unknown) => dayjs(Number(`${value}`)).format('DD/M/YYYY'),
  },
  {
    fromKey: 'updatedAt',
    toKey: 'updated',
    toValue: (value: unknown) => {
      if (typeof value !== 'string') {
        return value
      }
      return dayjs(value, 'DD/MM/YYYY').format('DD/M/YYYY')
    },
  },
]

const diffConfig: DiffConfig = {
  ignoreKeys: ['id', 'date'],
  numericTolerance: 0.01,
  transformations,
}

export const isAcceptableDifference = (
  val1: unknown,
  val2: unknown,
): boolean => {
  if (typeof val1 === 'number' && typeof val2 === 'number') {
    return Math.abs(val1 - val2) < (diffConfig.numericTolerance || 0)
  }
  return false
}

const transform = (o: Record<string, unknown>) => {
  const { transformations } = diffConfig
  return transformations?.length
    ? Object.keys(o).reduce(
        (acc, key) => {
          const transformation = transformations.find(
            ({ fromKey }) => fromKey === key,
          )
          const value = o[key]
          if (!transformation) {
            acc[key] = o[key]
            return acc
          }
          const transformedValue = transformation.toValue(value)
          if (verbose) {
            console.log(`Value ${value} transformed to ${transformedValue}`)
          }
          acc[transformation.toKey] = transformedValue
          return acc
        },
        {} as Record<string, unknown>,
      )
    : o
}

export const deepCompare = (
  o1: Record<string, unknown>,
  o2: Record<string, unknown>,
  path = '',
): string[] => {
  const transformedO1 = transform(o1)
  if (verbose) {
    console.log('Transformed object 1:', transformedO1)
  }
  const diffs: string[] = []
  const keys = new Set([...Object.keys(transformedO1), ...Object.keys(o2)])
  for (const key of keys) {
    const currentPath = path ? `${path}.${key}` : key
    if (diffConfig.ignoreKeys.includes(currentPath)) {
      continue
    }
    const val1 = transformedO1[key]
    const val2 = o2[key]
    if (verbose) {
      console.log(
        `Comparing ${JSON.stringify(val1)} and ${JSON.stringify(val2)}`,
      )
    }
    if (isEqual(val1, val2)) {
      continue
    }
    if (isAcceptableDifference(val1, val2)) {
      continue
    }
    if (isObject(val1) && isObject(val2)) {
      diffs.push(...deepCompare(val1, val2, currentPath))
    } else {
      diffs.push(`Difference at '${currentPath}': ${val1} !== ${val2}`)
    }
  }
  return diffs
}
