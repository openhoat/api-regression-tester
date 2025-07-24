import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

type PosPayload = {
  accountSession: {
    accountSessionNumber: string
    accountSessionDateTime: string
  }
  channelLniata: string
  countryCode: string
  currency: string
  machineTypeCode: string
  revenueOfficeCode: string
  rrCityCode: string
  saleDeviceCode: string
  uicCityCode: string
  locationRrCityCode: string
}

export const posRouter = async (fastify: FastifyInstance) => {
  fastify.post(
    '/',
    async (req: FastifyRequest<{ Body: PosPayload }>, reply: FastifyReply) => {
      const payload = req.body
      if (payload.accountSession.accountSessionNumber !== '8203') {
        reply.status(403).send({ message: 'Unauthorized' })
        return
      }
      reply.status(201)
      reply.header('X-Amzn-RequestId', '54bb05bd-886e-4177-9f9e-88e68ea9dc14')
      reply.header('X-CorrelationId', '4739498f-480e-4b7e-97e5-3fdda2466521')
      reply.header('X-Request-Id', '9cf73802-286e-41e5-8028-efbd20941aae')
      reply.header('X-Amz-Apigw-Id', 'OJuUIGB-CGYFVTA=')
      reply.header(
        'X-Amzn-Trace-Id',
        'Root=1-688090e6-1e1aaf70777d66866796fff2;Parent=49daa3c17f5055a9;Sampled=0;Lineage=2:590aed8e:0',
      )
      const pointOfSalesId = '8ccd4923-0542-4e85-8c26-adf3e513a4f5'
      return { pointOfSalesId }
    },
  )
}
