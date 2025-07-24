import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { FastifyInstance } from 'fastify'

export const tripsRouter = async (fastify: FastifyInstance) => {
  fastify.get('/', async () => {
    const content = await readFile(
      join(__dirname, 'response-body.json'),
      'utf-8',
    )
    return JSON.parse(content)
  })
}
