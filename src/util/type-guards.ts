import { isObject as isLodashObject } from 'lodash'

export const isObject = (o: unknown): o is Record<string, unknown> =>
  isLodashObject(o)
