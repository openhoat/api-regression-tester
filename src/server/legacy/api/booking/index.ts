import { fastifyBasicAuth } from '@fastify/basic-auth'
import type { FastifyInstance } from 'fastify'
import { posRouter } from './pos'
import { proposalsRouter } from './proposals'

export const bookingRouter = async (fastify: FastifyInstance) => {
  const authenticate = { realm: 'Test Realm' }
  const validate = async (username: string, password: string) => {
    if (username !== 'solar' || password !== 'password') {
      throw new Error('Bad username or password!')
    }
  }
  fastify.register(fastifyBasicAuth, { validate, authenticate })
  fastify.after(() => {
    fastify.register(posRouter, { prefix: '/point-of-sales' })
    fastify.register(proposalsRouter, { prefix: '/proposals/v3' })
  })
}
