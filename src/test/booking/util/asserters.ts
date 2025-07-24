import assert from 'node:assert'
import { JSONPath } from 'jsonpath-plus'
import type { JsonRecord } from '../../../util/types'

export const asserters: Record<
  string,
  (store: JsonRecord, ...args: unknown[]) => void
> = {
  equal: (store: JsonRecord, ...args: unknown[]) => {
    const firstArgString = `${args[0]}`
    const secondArgString = `${args[1]}`
    const [actualValue] = firstArgString?.startsWith('$')
      ? JSONPath({ path: firstArgString, json: store })
      : [firstArgString]
    const [expectedValue] = secondArgString?.startsWith('$')
      ? JSONPath({ path: secondArgString, json: store })
      : [secondArgString]
    console.log('actualValue:', actualValue)
    console.log('expectedValue:', expectedValue)
    assert.deepStrictEqual(`${actualValue}`, `${expectedValue}`)
  },
}
