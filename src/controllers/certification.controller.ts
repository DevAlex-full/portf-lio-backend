import type { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../lib/prisma'

// ============================================================
// GET /api/certifications — Público
// ============================================================
export async function getCertifications(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const certs = await prisma.certification.findMany({
    where:   { active: true },
    orderBy: [{ order: 'asc' }, { year: 'desc' }],
  })
  return reply.send(certs)
}

// ============================================================
// GET /api/certifications/all — Admin
// ============================================================
export async function getAllCertifications(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const certs = await prisma.certification.findMany({
    orderBy: [{ order: 'asc' }, { year: 'desc' }],
  })
  return reply.send(certs)
}

// ============================================================
// POST /api/certifications — Admin
// ============================================================
export async function createCertification(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const body = req.body as {
    title:       string
    institution: string
    year:        number
    hours?:      number
    tags?:       string[]
    stars?:      number
    link?:       string
    imageUrl?:   string
    pdfUrl?:     string
    inProgress?: boolean
    order?:      number
    active?:     boolean
  }

  if (!body.title || !body.institution || !body.year) {
    return reply.status(400).send({ error: 'Título, instituição e ano são obrigatórios.' })
  }

  const cert = await prisma.certification.create({
    data: {
      title:       body.title,
      institution: body.institution,
      year:        body.year,
      hours:       body.hours      ?? 0,
      tags:        body.tags       ?? [],
      stars:       body.stars      ?? 5,
      link:        body.link,
      imageUrl:    body.imageUrl,
      pdfUrl:      body.pdfUrl,
      inProgress:  body.inProgress ?? false,
      order:       body.order      ?? 0,
      active:      body.active     ?? true,
    },
  })

  return reply.status(201).send(cert)
}

// ============================================================
// PUT /api/certifications/:id — Admin
// ============================================================
export async function updateCertification(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { id } = req.params as { id: string }
  const body   = req.body as Partial<{
    title:       string; institution: string; year: number
    hours:       number; tags: string[]; stars: number
    link:        string; imageUrl: string; pdfUrl: string
    inProgress:  boolean; order: number; active: boolean
  }>

  const existing = await prisma.certification.findUnique({ where: { id } })
  if (!existing) return reply.status(404).send({ error: 'Certificado não encontrado.' })

  const cert = await prisma.certification.update({ where: { id }, data: body })
  return reply.send(cert)
}

// ============================================================
// DELETE /api/certifications/:id — Admin
// ============================================================
export async function deleteCertification(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { id } = req.params as { id: string }
  const existing = await prisma.certification.findUnique({ where: { id } })
  if (!existing) return reply.status(404).send({ error: 'Certificado não encontrado.' })

  await prisma.certification.delete({ where: { id } })
  return reply.send({ message: 'Certificado deletado com sucesso!' })
}
