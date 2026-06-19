import type { FastifyRequest, FastifyReply } from 'fastify'
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'

// ============================================================
// GET /api/clients — Público: lista clientes ativos
// ============================================================
export async function getClients(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const clients = await prisma.client.findMany({
    where:   { active: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  })
  return reply.send(clients)
}

// ============================================================
// GET /api/clients/all — Admin: todos (incluindo inativos)
// ============================================================
export async function getAllClients(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const clients = await prisma.client.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  })
  return reply.send(clients)
}

// ============================================================
// POST /api/clients — Admin: criar cliente/case
// ============================================================
export async function createClient(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const body = req.body as {
    name:          string
    subtitle?:     string
    segment?:      string
    description?:  string
    image?:        string
    images?:       Prisma.InputJsonValue
    technologies?: string[]
    metrics?:      Prisma.InputJsonValue
    linkDemo?:     string
    linkGithub?:   string
    featured?:     boolean
    order?:        number
    active?:       boolean
  }

  if (!body.name) {
    return reply.status(400).send({ error: 'Nome é obrigatório.' })
  }

  const client = await prisma.client.create({
    data: {
      name:         body.name,
      subtitle:     body.subtitle,
      segment:      body.segment,
      description:  body.description ?? '',
      image:        body.image,
      images:       (body.images  ?? []) as Prisma.InputJsonValue,
      technologies: body.technologies     ?? [],
      metrics:      (body.metrics ?? []) as Prisma.InputJsonValue,
      linkDemo:     body.linkDemo,
      linkGithub:   body.linkGithub,
      featured:     body.featured ?? false,
      order:        body.order    ?? 0,
      active:       body.active   ?? true,
    },
  })

  return reply.status(201).send(client)
}

// ============================================================
// PUT /api/clients/:id — Admin: atualizar cliente/case
// ============================================================
export async function updateClient(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { id } = req.params as { id: string }
  const body   = req.body as Partial<{
    name:         string
    subtitle:     string
    segment:      string
    description:  string
    image:        string
    images:       Prisma.InputJsonValue
    technologies: string[]
    metrics:      Prisma.InputJsonValue
    linkDemo:     string
    linkGithub:   string
    featured:     boolean
    order:        number
    active:       boolean
  }>

  const existing = await prisma.client.findUnique({ where: { id } })
  if (!existing) return reply.status(404).send({ error: 'Cliente não encontrado.' })

  const client = await prisma.client.update({
    where: { id },
    data: {
      ...body,
      // Cast explícito de segurança para os campos Json — mesma correção
      // já aplicada em project.controller.ts / single-record.controller.ts.
      images: body.images !== undefined
        ? (body.images as Prisma.InputJsonValue)
        : undefined,
      metrics: body.metrics !== undefined
        ? (body.metrics as Prisma.InputJsonValue)
        : undefined,
    },
  })

  return reply.send(client)
}

// ============================================================
// DELETE /api/clients/:id — Admin: deletar
// ============================================================
export async function deleteClient(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { id } = req.params as { id: string }
  const existing = await prisma.client.findUnique({ where: { id } })
  if (!existing) return reply.status(404).send({ error: 'Cliente não encontrado.' })

  await prisma.client.delete({ where: { id } })
  return reply.send({ message: 'Cliente deletado com sucesso!' })
}

// ============================================================
// PATCH /api/clients/:id/order — Admin: reordenar
// ============================================================
export async function updateClientOrder(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { id }    = req.params as { id: string }
  const { order } = req.body as { order: number }

  await prisma.client.update({ where: { id }, data: { order } })
  return reply.send({ message: 'Ordem atualizada.' })
}