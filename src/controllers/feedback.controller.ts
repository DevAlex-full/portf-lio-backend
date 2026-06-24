import type { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../lib/prisma'

// ============================================================
// GET /api/feedbacks — Público: feedbacks ativos
// ============================================================
export async function getFeedbacks(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const feedbacks = await prisma.feedback.findMany({
    where:   { active: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  })
  return reply.send(feedbacks)
}

// ============================================================
// GET /api/feedbacks/all — Admin: todos
// ============================================================
export async function getAllFeedbacks(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const feedbacks = await prisma.feedback.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  })
  return reply.send(feedbacks)
}

// ============================================================
// POST /api/feedbacks — Admin: criar
// ============================================================
export async function createFeedback(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const body = req.body as {
    clientName:   string
    clientRole?:  string
    company?:     string
    projectName?: string
    content:      string
    rating?:      number
    imageUrl?:    string
    featured?:    boolean
    active?:      boolean
    order?:       number
  }

  if (!body.clientName || !body.content) {
    return reply.status(400).send({ error: 'Nome do cliente e conteúdo são obrigatórios.' })
  }

  const feedback = await prisma.feedback.create({
    data: {
      clientName:  body.clientName,
      clientRole:  body.clientRole,
      company:     body.company,
      projectName: body.projectName,
      content:     body.content,
      rating:      body.rating   ?? 5,
      imageUrl:    body.imageUrl,
      featured:    body.featured ?? false,
      active:      body.active   ?? true,
      order:       body.order    ?? 0,
    },
  })

  return reply.status(201).send(feedback)
}

// ============================================================
// PUT /api/feedbacks/:id — Admin: editar
// ============================================================
export async function updateFeedback(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { id } = req.params as { id: string }
  const body   = req.body as Partial<{
    clientName:  string
    clientRole:  string
    company:     string
    projectName: string
    content:     string
    rating:      number
    imageUrl:    string
    featured:    boolean
    active:      boolean
    order:       number
  }>

  const existing = await prisma.feedback.findUnique({ where: { id } })
  if (!existing) return reply.status(404).send({ error: 'Feedback não encontrado.' })

  const feedback = await prisma.feedback.update({ where: { id }, data: body })
  return reply.send(feedback)
}

// ============================================================
// DELETE /api/feedbacks/:id — Admin: deletar
// ============================================================
export async function deleteFeedback(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { id } = req.params as { id: string }
  const existing = await prisma.feedback.findUnique({ where: { id } })
  if (!existing) return reply.status(404).send({ error: 'Feedback não encontrado.' })

  await prisma.feedback.delete({ where: { id } })
  return reply.send({ message: 'Feedback deletado com sucesso!' })
}