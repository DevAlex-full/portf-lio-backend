import type { FastifyPluginCallback } from 'fastify'
import {
  getCertifications, getAllCertifications,
  createCertification, updateCertification, deleteCertification,
} from '../controllers/certification.controller'
import {
  getSkills, getAllSkills,
  createSkill, updateSkill, deleteSkill,
} from '../controllers/skill.controller'
import {
  getServices,
  getAllPlans, createPlan, updatePlan, deletePlan,
  getAllExtras, createExtra, updateExtra, deleteExtra,
} from '../controllers/service.controller'
import {
  createLead, getLeads, getLead, updateLead,
  updateLeadStatus, archiveLead, deleteLead,
} from '../controllers/lead.controller'
import { getDashboardStats } from '../controllers/dashboard.controller'

// ============================================================
// CERTIFICATIONS
// ============================================================
export const certificationRoutes: FastifyPluginCallback = (fastify, _opts, done) => {
  fastify.get('/', getCertifications)
  fastify.get('/all', { preHandler: [fastify.authenticate] }, getAllCertifications)
  fastify.post('/', { preHandler: [fastify.authenticate] }, createCertification)
  fastify.put('/:id', { preHandler: [fastify.authenticate] }, updateCertification)
  fastify.delete('/:id', { preHandler: [fastify.authenticate] }, deleteCertification)
  done()
}

// ============================================================
// SKILLS
// ============================================================
export const skillRoutes: FastifyPluginCallback = (fastify, _opts, done) => {
  fastify.get('/', getSkills)
  fastify.get('/all', { preHandler: [fastify.authenticate] }, getAllSkills)
  fastify.post('/', { preHandler: [fastify.authenticate] }, createSkill)
  fastify.put('/:id', { preHandler: [fastify.authenticate] }, updateSkill)
  fastify.delete('/:id', { preHandler: [fastify.authenticate] }, deleteSkill)
  done()
}

// ============================================================
// SERVICES — plans + extras
// ============================================================
export const serviceRoutes: FastifyPluginCallback = (fastify, _opts, done) => {
  // Público: tudo junto
  fastify.get('/', getServices)

  // Admin — Planos
  fastify.get('/plans', { preHandler: [fastify.authenticate] }, getAllPlans)
  fastify.post('/plans', { preHandler: [fastify.authenticate] }, createPlan)
  fastify.put('/plans/:id', { preHandler: [fastify.authenticate] }, updatePlan)
  fastify.delete('/plans/:id', { preHandler: [fastify.authenticate] }, deletePlan)

  // Admin — Extras
  fastify.get('/extras', { preHandler: [fastify.authenticate] }, getAllExtras)
  fastify.post('/extras', { preHandler: [fastify.authenticate] }, createExtra)
  fastify.put('/extras/:id', { preHandler: [fastify.authenticate] }, updateExtra)
  fastify.delete('/extras/:id', { preHandler: [fastify.authenticate] }, deleteExtra)

  done()
}

// ============================================================
// LEADS
// ============================================================
export const leadRoutes: FastifyPluginCallback = (fastify, _opts, done) => {
  // Público: criação via formulário de contato
  fastify.post('/', createLead)

  // Admin
  fastify.get('/', { preHandler: [fastify.authenticate] }, getLeads)
  fastify.get('/:id', { preHandler: [fastify.authenticate] }, getLead)
  fastify.put('/:id', { preHandler: [fastify.authenticate] }, updateLead)
  fastify.patch('/:id/status', { preHandler: [fastify.authenticate] }, updateLeadStatus)
  fastify.patch('/:id/archive', { preHandler: [fastify.authenticate] }, archiveLead)
  fastify.delete('/:id', { preHandler: [fastify.authenticate] }, deleteLead)

  done()
}

// ============================================================
// DASHBOARD
// ============================================================
export const dashboardRoutes: FastifyPluginCallback = (fastify, _opts, done) => {
  fastify.get('/stats', { preHandler: [fastify.authenticate] }, getDashboardStats)
  done()
}