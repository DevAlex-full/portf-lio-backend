import type { FastifyPluginCallback } from 'fastify'
import {
  getHero, updateHero,
  getAbout, updateAbout,
  getContact, updateContact,
  getSettings, updateSettings,
} from '../controllers/single-record.controller'

// ============================================================
// HERO
// ============================================================
export const heroRoutes: FastifyPluginCallback = (fastify, _opts, done) => {
  fastify.get('/', getHero)
  fastify.put('/', { preHandler: [fastify.authenticate] }, updateHero)
  done()
}

// ============================================================
// ABOUT
// ============================================================
export const aboutRoutes: FastifyPluginCallback = (fastify, _opts, done) => {
  fastify.get('/', getAbout)
  fastify.put('/', { preHandler: [fastify.authenticate] }, updateAbout)
  done()
}

// ============================================================
// CONTACT
// ============================================================
export const contactRoutes: FastifyPluginCallback = (fastify, _opts, done) => {
  fastify.get('/', getContact)
  fastify.put('/', { preHandler: [fastify.authenticate] }, updateContact)
  done()
}

// ============================================================
// SETTINGS
// ============================================================
export const settingsRoutes: FastifyPluginCallback = (fastify, _opts, done) => {
  fastify.get('/', getSettings)
  fastify.put('/', { preHandler: [fastify.authenticate] }, updateSettings)
  done()
}
