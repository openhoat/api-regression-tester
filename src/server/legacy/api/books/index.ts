import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { v4 as uuidv4 } from 'uuid'

export interface Book {
  id: string
  title: string
  author: string
  createdAt: number
}

const books: Book[] = [
  {
    id: uuidv4(),
    title: 'Notre-Dame de Paris',
    author: 'Victor Hugo',
    createdAt: 1550044806000,
  },
  {
    id: uuidv4(),
    title: 'Le Petit Prince',
    author: 'Antoine de Saint-Exupéry',
    createdAt: 1297584006000,
  },
]

export const booksRouter = async (fastify: FastifyInstance) => {
  fastify.get(
    '/',
    async (req: FastifyRequest<{ Querystring: { title?: string } }>) => {
      const { title } = req.query
      if (title) {
        return books.filter((book) => book.title === title)
      }
      return books
    },
  )
  fastify.get(
    '/:id',
    (
      req: FastifyRequest<{
        Params: { id: string }
      }>,
      reply: FastifyReply,
    ) => {
      const { id } = req.params
      const book = books.find((b) => b.id === id)
      if (!book) {
        reply.callNotFound()
        return
      }
      return book
    },
  )
}
