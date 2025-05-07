import Fastify from 'fastify'
import type { LevelWithSilentOrString } from 'pino'
import type { Service } from '../../util/service'
import { apiRouter } from './api'

export const createServer = (options?: {
  port?: number
  logLevel?: LevelWithSilentOrString
}): Service => {
  const { port, logLevel } = options ?? {}
  const app = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
      level: logLevel,
    },
  })
  app.register(apiRouter, { prefix: '/api' })
  return {
    start: async () => {
      await app.listen({ port: port ?? 3000, host: '0.0.0.0' })
    },
    stop: async () => {
      await app.close()
    },
  }
}
