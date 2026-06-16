import type { FastifyPluginCallback } from 'fastify'
import {
  getProjects,
  getProjectBySlug,
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  updateProjectOrder,
} from '../controllers/project.controller'

export const projectRoutes: FastifyPluginCallback = (fastify, _opts, done) => {
  // ── Públicas ─────────────────────────────────────────────
  fastify.get('/', getProjects)

  // ── /all ANTES de /:slug — estática tem prioridade explícita ──
  fastify.get('/all', { preHandler: [fastify.authenticate] }, getAllProjects)

  // ── Rota dinâmica APÓS todas as rotas estáticas ───────────
  fastify.get('/:slug', getProjectBySlug)

  // ── Admin — mutações ──────────────────────────────────────
  fastify.post('/',            { preHandler: [fastify.authenticate] }, createProject)
  fastify.put('/:id',          { preHandler: [fastify.authenticate] }, updateProject)
  fastify.delete('/:id',       { preHandler: [fastify.authenticate] }, deleteProject)
  fastify.patch('/:id/order',  { preHandler: [fastify.authenticate] }, updateProjectOrder)

  done()
}
