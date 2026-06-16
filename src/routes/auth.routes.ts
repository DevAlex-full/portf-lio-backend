import type { FastifyPluginCallback } from 'fastify'
import { login, me, changePassword } from '../controllers/auth.controller'

export const authRoutes: FastifyPluginCallback = (fastify, _opts, done) => {
  // POST /api/auth/login
  fastify.post('/login', login)

  // GET /api/auth/me — protegido
  fastify.get('/me', { preHandler: [fastify.authenticate] }, me)

  // POST /api/auth/change-password — protegido
  fastify.post('/change-password', { preHandler: [fastify.authenticate] }, changePassword)

  done()
}
