import type { FastifyInstance } from 'fastify'
import { bookingRouter } from './booking'
import { booksRouter } from './books'

export const apiRouter = async (fastify: FastifyInstance) => {
  fastify.register(bookingRouter, { prefix: '/booking' })
  fastify.register(booksRouter, { prefix: '/books' })
}
