import { afterAll, beforeAll, describe, expect, test } from '@jest/globals'
import { configSpec } from '../../config'
import { createServer as createActualServer } from '../../server/actual'
import { createServer as createLegacyServer } from '../../server/legacy'
import { buildConfig } from '../../util/config-builder'
import { type ApiResponse, sendRequest } from '../../util/http.helper'
import type { Service } from '../../util/service'
import { mockApis } from './api-mocks'
import { compareResponses } from './matchers/comparison.helper'
import { type ServerRequestTestCase, type Store, testcases } from './testcases'

const { legacyBaseUrl, actualBaseUrl, logLevel, timeout } =
  buildConfig(configSpec)

const { MOCK, LOCAL_API, VERBOSE } = process.env
const verbose = VERBOSE === 'true'
const mock = MOCK === 'true'
const localApi = LOCAL_API === 'true'

const validateAssertions = (name: string, res: ApiResponse) => {
  const { status, data } = res
  const hintPrefix = `${name} `
  const statusHint = `${hintPrefix} status`
  const dataHint = `${hintPrefix} data`
  expect(status).toMatchSnapshot(statusHint)
  if (Array.isArray(data)) {
    const expectedArray = Array(data.length).fill({ id: expect.any(String) })
    expect(data).toMatchSnapshot(expectedArray, dataHint)
  } else {
    expect(res.data).toMatchSnapshot({ id: expect.any(String) }, dataHint)
  }
}

const doServerRequest = async (
  baseUrl: string,
  serverRequest: ServerRequestTestCase,
  store: Store,
) => {
  const { before, request, after } = serverRequest
  if (before) {
    before({ store, request })
  }
  const response = await sendRequest(request, {
    baseUrl,
    timeout,
  })
  serverRequest.response = response
  if (after) {
    after({ store, request, response })
  }
  return response
}

describe('API regression test', () => {
  const stores = {
    // biome-ignore lint/suspicious/noExplicitAny: special case
    legacy: new Map<string, any>(),
    // biome-ignore lint/suspicious/noExplicitAny: special case
    actual: new Map<string, any>(),
  }
  const servers: {
    legacy: Service | null
    actual: Service | null
  } = { legacy: null, actual: null }
  beforeAll(async () => {
    if (localApi) {
      const legacyServer = createLegacyServer({ logLevel })
      const actualServer = createActualServer({ logLevel })
      await Promise.all([legacyServer.start(), actualServer.start()])
      servers.legacy = legacyServer
      servers.actual = actualServer
    }
    if (mock) {
      mockApis(legacyBaseUrl, actualBaseUrl)
    }
  })
  afterAll(async () => {
    const { legacy: legacyServer, actual: actualServer } = servers
    if (legacyServer) {
      await legacyServer.stop()
      servers.legacy = null
    }
    if (actualServer) {
      await actualServer.stop()
      servers.actual = null
    }
  })
  test.each(testcases)(
    'should return equivalent results for "$name" request',
    async ({ name, legacy, actual }) => {
      // When
      const [legacyRes, actualRes] = await Promise.all([
        doServerRequest(legacyBaseUrl, legacy, stores.legacy),
        doServerRequest(actualBaseUrl, actual ?? legacy, stores.actual),
      ])
      // Then
      validateAssertions(name, actualRes)
      if (verbose) {
        console.log('legacyRes:', legacyRes)
        console.log('actualRes:', actualRes)
      }
      const diffs = compareResponses(legacyRes, actualRes)
      expect(diffs).toStrictEqual([])
    },
  )
})
