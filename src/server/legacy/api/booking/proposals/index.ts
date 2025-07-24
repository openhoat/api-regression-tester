import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

type ProposalsPayload = {
  wish: {
    mainJourney: {
      origin: {
        type: unknown
        codes: {
          RESARAIL: {
            code: string
          }
        }
        label: unknown
        address: unknown
        longitude: number
        latitude: number
      }
      destination: {
        type: unknown
        codes: {
          RESARAIL: {
            code: string
          }
        }
        label: unknown
        address: unknown
        longitude: number
        latitude: number
      }
      via: unknown
    }
    asymmetricalJourney: unknown
    directTravel: boolean
    schedule: {
      outward: unknown
      inward: unknown
    }
    passengers: [
      {
        id: string
        typology: string
        customerId: string | null
        firstname: string | null
        lastname: string
        dateOfBirth: string | null
        age: number
        discountCards: [unknown]
        fidelityCard: unknown
        kiOui: unknown
        promoCode: unknown
        bicycle: unknown
        disability: unknown
        externalId: string
      },
    ]
    pets: [unknown]
    codeFce: unknown
  }
  searchCriteria: {
    dateTimeRange: unknown
    itineraryEngineDebugParameters: unknown
    itineraryServiceParameters: {
      startOriginRadius: unknown
      startDestinationRadius: unknown
    }
    predictParameters: unknown
    transporterLabels: [unknown]
  }
  searchContext: {
    features: string[]
  }
  selectedTravel: unknown
}

export const proposalsRouter = async (fastify: FastifyInstance) => {
  fastify.after(() => {
    fastify.route({
      method: 'POST',
      url: '/',
      onRequest: fastify.basicAuth,
      handler: async (
        req: FastifyRequest<{ Body: ProposalsPayload }>,
        reply: FastifyReply,
      ) => {
        const payload = req.body
        console.log('payload:', payload)
        reply.header('X-Amzn-RequestId', 'c4364424-f9bb-4ec2-83ba-8ae220a053ce')
        reply.header('X-CorrelationId', '91ce33ce-b87b-49f5-8499-e1735ab6abb5')
        reply.header('X-Envoy-Upstream-Service-Time', '1124')
        reply.header('X-Request-Id', '7884a876-6344-4764-851e-448585edf5e3')
        reply.header('X-Amz-Apigw-Id', 'OJ5TnG2RiGYFXCg=')
        const content = await readFile(
          join(__dirname, 'response-body.json'),
          'utf-8',
        )
        return JSON.parse(content)
      },
    })
  })
}
