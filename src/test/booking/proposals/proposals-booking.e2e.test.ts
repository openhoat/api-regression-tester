import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals'
import { configSpec } from '../../../config'
import { createServer as createActualServer } from '../../../server/actual'
import { createServer as createLegacyServer } from '../../../server/legacy'
import { buildConfig } from '../../../util/config-builder'
import {
  type HttpSequence,
  loadYamlFile,
  runSequence,
} from '../../../util/http-sequence'
import type { Service } from '../../../util/service'
import { mockApis } from '../../books/api-mocks'
import { anyStringArray } from '../../util/test.helper'
import { asserters } from '../util/asserters'
import { transformers } from '../util/transformers'

const { legacyBaseUrl, actualBaseUrl, logLevel } = buildConfig(configSpec)

const { MOCK, LOCAL_API, VERBOSE } = process.env
const verbose = VERBOSE === 'true'
const mock = MOCK === 'true'
const localApi = LOCAL_API === 'true'

describe('Booking API e2e test', () => {
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
  describe('proposals sequence', () => {
    let sequence: HttpSequence
    beforeAll(async () => {
      sequence = await loadYamlFile(
        join(__dirname, 'proposals-booking.sequence.yml'),
      )
    })
    test('should execute proposals sequence', async () => {
      // When
      type ApiResult = {
        legacyOriginLocalityIds: string[]
        legacyDestinationLocalityIds: string[]
        legacySegmentOriginLocalityIds: string[]
        legacySegmentDestinationLocalityIds: string[]
        legacyOriginLocalityCodes: string[]
        legacyDestinationLocalityCodes: string[]
        legacyPrices: number[]
      }
      const store = await runSequence<ApiResult>(sequence, {
        transformers,
        asserters,
      })
      // Then
      if (verbose) {
        console.log('store state:', JSON.stringify(store.state, null, 2))
      }
      const { result } = store.state
      expect(result).toBeTruthy()
      expect(result).toMatchSnapshot({
        legacyOriginLocalityIds: anyStringArray(
          result?.legacyOriginLocalityIds.length,
        ),
        legacyDestinationLocalityIds: anyStringArray(
          result?.legacyDestinationLocalityIds.length,
        ),
        legacySegmentOriginLocalityIds: anyStringArray(
          result?.legacySegmentOriginLocalityIds.length,
        ),
        legacySegmentDestinationLocalityIds: anyStringArray(
          result?.legacySegmentDestinationLocalityIds.length,
        ),
      })
    })
  })
})
