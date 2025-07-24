import { JSONPath } from 'jsonpath-plus'
import type { JsonRecord } from '../../../util/types'

export const transformers: Record<
  string,
  (store: JsonRecord, ...args: unknown[]) => unknown
> = {
  findByIds: (store: JsonRecord, ...args: unknown[]) =>
    JSONPath<string[]>({
      path: `${args[0]}`,
      json: store,
    }).map(
      (id) =>
        JSONPath({
          path: `${args[1]}[?(@.id === "${id}")].${args[2]}`,
          json: store,
        })[0],
    ),
}
