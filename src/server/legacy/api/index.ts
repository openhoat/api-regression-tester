import type { FastifyInstance } from 'fastify'
import { booksRouter } from './books'

export const apiRouter = async (fastify: FastifyInstance) => {
  fastify.register(booksRouter, { prefix: '/books' })
}
