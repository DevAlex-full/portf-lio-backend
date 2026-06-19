import type { FastifyPluginCallback } from 'fastify'
import {
  getClients,
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
  updateClientOrder,
} from '../controllers/client.controller'

export const clientRoutes: FastifyPluginCallback = (fastify, _opts, done) => {
  // ── Pública ──────────────────────────────────────────────
  fastify.get('/', getClients)

  // ── Admin ────────────────────────────────────────────────
  fastify.get('/all', { preHandler: [fastify.authenticate] }, getAllClients)
  fastify.post('/', { preHandler: [fastify.authenticate] }, createClient)
  fastify.put('/:id', { preHandler: [fastify.authenticate] }, updateClient)
  fastify.delete('/:id', { preHandler: [fastify.authenticate] }, deleteClient)
  fastify.patch('/:id/order', { preHandler: [fastify.authenticate] }, updateClientOrder)

  done()
}