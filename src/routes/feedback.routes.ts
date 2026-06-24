import type { FastifyPluginCallback } from 'fastify'
import {
  getFeedbacks, getAllFeedbacks,
  createFeedback, updateFeedback, deleteFeedback,
} from '../controllers/feedback.controller'

export const feedbackRoutes: FastifyPluginCallback = (fastify, _opts, done) => {
  // Pública
  fastify.get('/',    getFeedbacks)
  // Admin — estática ANTES de dinâmica
  fastify.get('/all', { preHandler: [fastify.authenticate] }, getAllFeedbacks)
  fastify.post('/',   { preHandler: [fastify.authenticate] }, createFeedback)
  fastify.put('/:id', { preHandler: [fastify.authenticate] }, updateFeedback)
  fastify.delete('/:id', { preHandler: [fastify.authenticate] }, deleteFeedback)

  done()
}