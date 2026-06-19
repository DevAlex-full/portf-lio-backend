import 'dotenv/config'
import Fastify from 'fastify'
import cors      from '@fastify/cors'
import jwt       from '@fastify/jwt'
import multipart from '@fastify/multipart'

import authPlugin from './plugins/auth.plugin'

import { authRoutes }    from './routes/auth.routes'
import { mediaRoutes }   from './routes/media.routes'
import { projectRoutes } from './routes/project.routes'
import { clientRoutes }  from './routes/client.routes'
import {
  certificationRoutes,
  skillRoutes,
  serviceRoutes,
  leadRoutes,
  dashboardRoutes,
} from './routes/content.routes'
import {
  heroRoutes,
  aboutRoutes,
  contactRoutes,
  settingsRoutes,
} from './routes/single-record.routes'

import { ensureBucket } from './lib/supabase'

// ── Validações de env ────────────────────────────────────────
const REQUIRED_ENV = [
  'DATABASE_URL',
  'DIRECT_URL',
  'JWT_SECRET',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
]

for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`❌ Variável de ambiente ausente: ${key}`)
    process.exit(1)
  }
}

// ── Logger: usa pino-pretty em dev, JSON em produção ────────
const isDev = process.env.NODE_ENV !== 'production'

const app = Fastify({
  logger: isDev
    ? {
        level:     'info',
        transport: {
          target:  'pino-pretty',
          options: { colorize: true, translateTime: 'SYS:standard', ignore: 'pid,hostname' },
        },
      }
    : { level: 'warn' },
})

async function bootstrap(): Promise<void> {
  // ── CORS ───────────────────────────────────────────────────
  await app.register(cors, {
    origin: (origin, cb) => {
      const allowed: Array<string | RegExp> = [
        process.env.FRONTEND_URL ?? 'http://localhost:3000',
        /\.vercel\.app$/,
        /localhost:\d+$/,
      ]
      if (!origin) return cb(null, true)
      const ok = allowed.some(p =>
        typeof p === 'string' ? p === origin : p.test(origin)
      )
      cb(ok ? null : new Error('Not allowed by CORS'), ok)
    },
    credentials:    true,
    methods:        ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

  // ── JWT ────────────────────────────────────────────────────
  await app.register(jwt, {
    secret: process.env.JWT_SECRET!,
  })

  // ── Multipart (file uploads) ───────────────────────────────
  await app.register(multipart, {
    limits: {
      fileSize: 52_428_800, // 50 MB
      files:    20,
    },
  })

  // ── Auth decorator ─────────────────────────────────────────
  await app.register(authPlugin)

  // ── Rotas ──────────────────────────────────────────────────
  await app.register(authRoutes,          { prefix: '/api/auth' })
  await app.register(mediaRoutes,         { prefix: '/api/media' })
  await app.register(projectRoutes,       { prefix: '/api/projects' })
  await app.register(clientRoutes,        { prefix: '/api/clients' })
  await app.register(certificationRoutes, { prefix: '/api/certifications' })
  await app.register(skillRoutes,         { prefix: '/api/skills' })
  await app.register(serviceRoutes,       { prefix: '/api/services' })
  await app.register(leadRoutes,          { prefix: '/api/leads' })
  await app.register(dashboardRoutes,     { prefix: '/api/dashboard' })
  await app.register(heroRoutes,          { prefix: '/api/hero' })
  await app.register(aboutRoutes,         { prefix: '/api/about' })
  await app.register(contactRoutes,       { prefix: '/api/contact' })
  await app.register(settingsRoutes,      { prefix: '/api/settings' })

  // ── Health check ───────────────────────────────────────────
  app.get('/health', async () => ({
    status:    'ok',
    timestamp: new Date().toISOString(),
    env:       process.env.NODE_ENV ?? 'development',
  }))

  // ── Error handler global ───────────────────────────────────
  app.setErrorHandler((error, _req, reply) => {
    app.log.error(error)
    return reply.status(error.statusCode ?? 500).send({
      error: error.message ?? 'Erro interno do servidor.',
      code:  error.code,
    })
  })

  // ── Supabase bucket ────────────────────────────────────────
  await ensureBucket()

  // ── Listen ─────────────────────────────────────────────────
  const port = Number(process.env.PORT ?? 3001)
  await app.listen({ port, host: '0.0.0.0' })
  console.log(`🚀 Portfolio API rodando na porta ${port}`)
}

bootstrap().catch(err => {
  console.error('❌ Falha ao iniciar servidor:', err)
  process.exit(1)
})