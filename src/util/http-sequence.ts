import { readFile } from 'node:fs/promises'
import { JSONPath } from 'jsonpath-plus'
import _ from 'lodash'
import { parse } from 'yaml'
import {
  type ApiRequest,
  type ApiResponse,
  type HttpMethod,
  sendRequest,
} from './http.helper'
import type { JsonRecord, JsonValue } from './types'

export type HttpSequenceStep = {
  name: string
  request: {
    method: HttpMethod
    endpoint: string
    basicAuth?: {
      username: string
      password: string
    }
    headers?: Record<string, string>
    queryParams?: Record<string, string>
    payload?: unknown
  }
  transformations?: {
    key: string
    type?: string
    value?: unknown
    args?: string[]
  }[]
  assertions?: { name: string; type: string; args?: string[] }[]
}

export type HttpSequence = {
  name: string
  baseUrl?: string
  steps: HttpSequenceStep[]
  responseMapping: Record<string, string>
}

export type ConversationStep = {
  request: ApiRequest
  response?: ApiResponse
}

export type Conversation = Record<string, ConversationStep>

export type HttpSequenceState<T extends JsonRecord> = {
  result?: T
} & JsonRecord

export type HttpSequenceResult<T extends JsonRecord> = {
  conversation: Conversation
  state: HttpSequenceState<T>
}

export type Asserter = (store: JsonRecord, ...args: unknown[]) => void

export type Asserters = Record<string, Asserter>

export type Transformer = (store: JsonRecord, ...args: unknown[]) => unknown

export type Transformers = Record<string, Transformer>

export type SequenceOptions<T extends JsonRecord> = Partial<{
  conversation: Conversation
  state: HttpSequenceState<T>
  asserters: Asserters
  transformers: Transformers
}>

export type SequenceStepOptions<T extends JsonRecord> = Partial<{
  baseUrl: string
}> &
  SequenceOptions<T>

export const evaluateValue = (
  value: string,
  store: JsonRecord,
  defaultValue: unknown = undefined,
) => {
  if (!value.startsWith('$')) {
    return defaultValue
  }
  const [computedValue] = JSONPath({ path: value, json: store })
  return computedValue
}

export const runSequenceStep = async <T extends JsonRecord>(
  step: HttpSequenceStep,
  options?: SequenceStepOptions<T>,
): Promise<HttpSequenceResult<T>> => {
  const { name, request, transformations, assertions } = step
  const {
    conversation = {} satisfies Conversation,
    state = {} as HttpSequenceState<T>,
    asserters,
    transformers,
  } = options ?? {}
  const store = { conversation, state } as unknown as JsonRecord
  const { endpoint, method, queryParams, headers, payload, basicAuth } = request
  if (headers) {
    for (const [key, value] of Object.entries(headers)) {
      headers[key] = `${evaluateValue(value, store, value)}`
    }
  }
  const apiRequest: ApiRequest = {
    method,
    path: endpoint,
    basicAuth,
    headers,
    params: queryParams,
    body: payload,
  }
  if (!conversation[name]) {
    conversation[name] = { request: apiRequest }
  }
  conversation[name].response = await sendRequest<JsonValue>(apiRequest, {
    baseUrl: options?.baseUrl,
  })
  if (transformations) {
    transformations.forEach(({ key, type, value, args = [] }) => {
      const transformer = type && transformers?.[type]
      if (type && !transformer) {
        throw new Error(`Missing transformer for type "${type}"`)
      }
      const finalValue = transformer
        ? transformer(store, ...args)
        : JSONPath({ path: `${value}`, json: store })
      _.set(state, `result.${key}`, finalValue)
    })
  }
  if (assertions) {
    assertions.forEach(({ type, args = [] }) => {
      const asserter = asserters?.[type]
      if (!asserter) {
        throw new Error(`Missing asserter for type "${type}"`)
      }
      asserter(store, ...args)
    })
  }
  return store as unknown as { conversation: Conversation; state: T }
}

export const runSequence = async <T extends JsonRecord>(
  sequence: HttpSequence,
  options?: SequenceOptions<T>,
): Promise<HttpSequenceResult<T>> => {
  const { baseUrl, steps } = sequence
  const {
    conversation = {} satisfies Conversation,
    state = {} as HttpSequenceState<T>,
    asserters,
    transformers,
  } = options ?? {}
  const store = { conversation, state }
  const promise = steps.reduce(
    async (acc: Promise<HttpSequenceResult<T>>, step) => {
      const { conversation, state } = await acc
      return runSequenceStep(step, {
        baseUrl,
        conversation,
        state,
        asserters,
        transformers,
      })
    },
    Promise.resolve(store),
  )
  await promise
  return store
}

export const loadYamlFile = async <T>(file: string): Promise<T> => {
  const content = await readFile(file, 'utf8')
  return parse(content) satisfies T
}
