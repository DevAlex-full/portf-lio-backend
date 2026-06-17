import type { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../lib/prisma'

const VALID_STATUSES = ['novo', 'em_contato', 'proposta', 'convertido', 'perdido'] as const
type LeadStatus = typeof VALID_STATUSES[number]

// ============================================================
// POST /api/leads — Público: criação via formulário de contato
// ============================================================
export async function createLead(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const body = req.body as {
    name:     string
    email:    string
    phone?:   string
    company?: string
    source?:  string
    message?: string
    status?:  string
  }

  if (!body.name || !body.email) {
    return reply.status(400).send({ error: 'Nome e email são obrigatórios.' })
  }

  const lead = await prisma.lead.create({
    data: {
      name:    body.name,
      email:   body.email,
      phone:   body.phone,
      company: body.company,
      source:  body.source,
      message: body.message,
      status:  body.status ?? 'novo',
    },
  })

  return reply.status(201).send({ message: 'Lead criado com sucesso!', lead })
}

// ============================================================
// GET /api/leads — Admin: listar (paginado + filtros)
// ============================================================
export async function getLeads(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const {
    page     = '1',
    limit    = '20',
    status,
    archived = 'false',
    search   = '',
  } = req.query as {
    page?: string; limit?: string; status?: string
    archived?: string; search?: string
  }

  const take = Math.min(Number(limit), 100)
  const skip = (Number(page) - 1) * take
  const q    = search.trim()

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where: {
        archived: archived === 'true',
        ...(status && { status }),
        ...(q && {
          OR: [
            { name:    { contains: q, mode: 'insensitive' as const } },
            { email:   { contains: q, mode: 'insensitive' as const } },
            { company: { contains: q, mode: 'insensitive' as const } },
          ],
        }),
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.lead.count({
      where: {
        archived: archived === 'true',
        ...(status && { status }),
        ...(q && {
          OR: [
            { name:    { contains: q, mode: 'insensitive' as const } },
            { email:   { contains: q, mode: 'insensitive' as const } },
            { company: { contains: q, mode: 'insensitive' as const } },
          ],
        }),
      },
    }),
  ])

  return reply.send({
    leads,
    total,
    page:       Number(page),
    totalPages: Math.ceil(total / take),
  })
}

// ============================================================
// GET /api/leads/:id — Admin: detalhe
// ============================================================
export async function getLead(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { id } = req.params as { id: string }
  const lead   = await prisma.lead.findUnique({ where: { id } })
  if (!lead) return reply.status(404).send({ error: 'Lead não encontrado.' })
  return reply.send(lead)
}

// ============================================================
// PUT /api/leads/:id — Admin: edição completa
// ============================================================
export async function updateLead(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { id } = req.params as { id: string }
  const body   = req.body as Partial<{
    name: string; email: string; phone: string
    company: string; source: string; message: string; status: string
  }>

  const existing = await prisma.lead.findUnique({ where: { id } })
  if (!existing) return reply.status(404).send({ error: 'Lead não encontrado.' })

  if (body.status && !VALID_STATUSES.includes(body.status as LeadStatus)) {
    return reply.status(400).send({
      error: `Status inválido. Opções: ${VALID_STATUSES.join(', ')}`,
    })
  }

  const lead = await prisma.lead.update({ where: { id }, data: body })
  return reply.send(lead)
}

// ============================================================
// PATCH /api/leads/:id/status — Admin: alterar status
// ============================================================
export async function updateLeadStatus(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { id }     = req.params as { id: string }
  const { status } = req.body as { status?: string }

  if (!status || !VALID_STATUSES.includes(status as LeadStatus)) {
    return reply.status(400).send({
      error: `Status inválido. Opções: ${VALID_STATUSES.join(', ')}`,
    })
  }

  const existing = await prisma.lead.findUnique({ where: { id } })
  if (!existing) return reply.status(404).send({ error: 'Lead não encontrado.' })

  const lead = await prisma.lead.update({ where: { id }, data: { status } })
  return reply.send(lead)
}

// ============================================================
// PATCH /api/leads/:id/archive — Admin: arquivar/desarquivar
// ============================================================
export async function archiveLead(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { id }       = req.params as { id: string }
  const { archived } = req.body as { archived?: boolean }

  const existing = await prisma.lead.findUnique({ where: { id } })
  if (!existing) return reply.status(404).send({ error: 'Lead não encontrado.' })

  const lead = await prisma.lead.update({
    where: { id },
    data:  { archived: archived ?? true },
  })

  return reply.send(lead)
}

// ============================================================
// DELETE /api/leads/:id — Admin: deletar permanentemente
// ============================================================
export async function deleteLead(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { id } = req.params as { id: string }
  const existing = await prisma.lead.findUnique({ where: { id } })
  if (!existing) return reply.status(404).send({ error: 'Lead não encontrado.' })

  await prisma.lead.delete({ where: { id } })
  return reply.send({ message: 'Lead deletado com sucesso!' })
}