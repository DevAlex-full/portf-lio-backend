import type { FastifyPluginCallback } from 'fastify'
import {
  uploadMedia,
  uploadMediaBatch,
  listMedia,
  deleteMedia,
} from '../controllers/media.controller'

export const mediaRoutes: FastifyPluginCallback = (fastify, _opts, done) => {
  // GET /api/media — Admin: listar biblioteca
  fastify.get('/', { preHandler: [fastify.authenticate] }, listMedia)

  // POST /api/media — Admin: upload único
  fastify.post('/', { preHandler: [fastify.authenticate] }, uploadMedia)

  // POST /api/media/batch — Admin: upload múltiplo
  fastify.post('/batch', { preHandler: [fastify.authenticate] }, uploadMediaBatch)

  // DELETE /api/media/:id — Admin: deletar
  fastify.delete('/:id', { preHandler: [fastify.authenticate] }, deleteMedia)

  done()
}
