import type { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../lib/prisma'

// ============================================================
// GET /api/skills — Público
// ============================================================
export async function getSkills(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const skills = await prisma.skill.findMany({
    where:   { active: true },
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  })
  return reply.send(skills)
}

// ============================================================
// GET /api/skills/all — Admin
// ============================================================
export async function getAllSkills(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const skills = await prisma.skill.findMany({
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  })
  return reply.send(skills)
}

// ============================================================
// POST /api/skills — Admin
// ============================================================
export async function createSkill(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const body = req.body as {
    name:      string
    category:  string
    icon:      string
    level?:    string
    order?:    number
    active?:   boolean
  }

  if (!body.name || !body.category || !body.icon) {
    return reply.status(400).send({ error: 'Nome, categoria e ícone são obrigatórios.' })
  }

  const skill = await prisma.skill.create({
    data: {
      name:     body.name,
      category: body.category,
      icon:     body.icon,
      level:    body.level  ?? 'intermediate',
      order:    body.order  ?? 0,
      active:   body.active ?? true,
    },
  })

  return reply.status(201).send(skill)
}

// ============================================================
// PUT /api/skills/:id — Admin
// ============================================================
export async function updateSkill(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { id } = req.params as { id: string }
  const body   = req.body as Partial<{
    name: string; category: string; icon: string
    level: string; order: number; active: boolean
  }>

  const existing = await prisma.skill.findUnique({ where: { id } })
  if (!existing) return reply.status(404).send({ error: 'Habilidade não encontrada.' })

  const skill = await prisma.skill.update({ where: { id }, data: body })
  return reply.send(skill)
}

// ============================================================
// DELETE /api/skills/:id — Admin
// ============================================================
export async function deleteSkill(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { id } = req.params as { id: string }
  const existing = await prisma.skill.findUnique({ where: { id } })
  if (!existing) return reply.status(404).send({ error: 'Habilidade não encontrada.' })

  await prisma.skill.delete({ where: { id } })
  return reply.send({ message: 'Habilidade deletada com sucesso!' })
}
