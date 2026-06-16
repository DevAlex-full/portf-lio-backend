import type { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../lib/prisma'

// ============================================================
// GET /api/services — Público: plans + extras
// ============================================================
export async function getServices(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const [plans, extras] = await Promise.all([
    prisma.servicePlan.findMany({
      where:   { active: true },
      orderBy: { order: 'asc' },
    }),
    prisma.serviceExtra.findMany({
      where:   { active: true },
      orderBy: { order: 'asc' },
    }),
  ])
  return reply.send({ plans, extras })
}

// ─── PLANS ────────────────────────────────────────────────────────────────────

export async function getAllPlans(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const plans = await prisma.servicePlan.findMany({ orderBy: { order: 'asc' } })
  return reply.send(plans)
}

export async function createPlan(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const body = req.body as {
    name:        string
    price:       string
    period?:     string
    description: string
    features?:   string[]
    highlighted?: boolean
    badge?:      string
    ctaText?:    string
    ctaMessage:  string
    order?:      number
    active?:     boolean
  }

  if (!body.name || !body.price || !body.description || !body.ctaMessage) {
    return reply.status(400).send({ error: 'Nome, preço, descrição e mensagem CTA são obrigatórios.' })
  }

  const plan = await prisma.servicePlan.create({
    data: {
      name:        body.name,
      price:       body.price,
      period:      body.period      ?? 'entrega única',
      description: body.description,
      features:    body.features    ?? [],
      highlighted: body.highlighted ?? false,
      badge:       body.badge,
      ctaText:     body.ctaText     ?? 'Solicitar Orçamento',
      ctaMessage:  body.ctaMessage,
      order:       body.order       ?? 0,
      active:      body.active      ?? true,
    },
  })

  return reply.status(201).send(plan)
}

export async function updatePlan(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { id } = req.params as { id: string }
  const body   = req.body as Partial<{
    name: string; price: string; period: string; description: string
    features: string[]; highlighted: boolean; badge: string
    ctaText: string; ctaMessage: string; order: number; active: boolean
  }>

  const existing = await prisma.servicePlan.findUnique({ where: { id } })
  if (!existing) return reply.status(404).send({ error: 'Plano não encontrado.' })

  const plan = await prisma.servicePlan.update({ where: { id }, data: body })
  return reply.send(plan)
}

export async function deletePlan(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { id } = req.params as { id: string }
  const existing = await prisma.servicePlan.findUnique({ where: { id } })
  if (!existing) return reply.status(404).send({ error: 'Plano não encontrado.' })

  await prisma.servicePlan.delete({ where: { id } })
  return reply.send({ message: 'Plano deletado com sucesso!' })
}

// ─── EXTRAS ───────────────────────────────────────────────────────────────────

export async function getAllExtras(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const extras = await prisma.serviceExtra.findMany({ orderBy: { order: 'asc' } })
  return reply.send(extras)
}

export async function createExtra(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const body = req.body as {
    label:       string
    description: string
    icon:        string
    order?:      number
    active?:     boolean
  }

  if (!body.label || !body.description || !body.icon) {
    return reply.status(400).send({ error: 'Label, descrição e ícone são obrigatórios.' })
  }

  const extra = await prisma.serviceExtra.create({
    data: {
      label:       body.label,
      description: body.description,
      icon:        body.icon,
      order:       body.order  ?? 0,
      active:      body.active ?? true,
    },
  })

  return reply.status(201).send(extra)
}

export async function updateExtra(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { id } = req.params as { id: string }
  const body   = req.body as Partial<{
    label: string; description: string; icon: string; order: number; active: boolean
  }>

  const existing = await prisma.serviceExtra.findUnique({ where: { id } })
  if (!existing) return reply.status(404).send({ error: 'Extra não encontrado.' })

  const extra = await prisma.serviceExtra.update({ where: { id }, data: body })
  return reply.send(extra)
}

export async function deleteExtra(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { id } = req.params as { id: string }
  const existing = await prisma.serviceExtra.findUnique({ where: { id } })
  if (!existing) return reply.status(404).send({ error: 'Extra não encontrado.' })

  await prisma.serviceExtra.delete({ where: { id } })
  return reply.send({ message: 'Extra deletado com sucesso!' })
}
