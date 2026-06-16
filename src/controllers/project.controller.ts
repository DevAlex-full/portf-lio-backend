import type { FastifyRequest, FastifyReply } from 'fastify'
import slugify from 'slugify'
import { prisma } from '../lib/prisma'

// ============================================================
// GET /api/projects — Público: lista projetos ativos
// ============================================================
export async function getProjects(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const projects = await prisma.project.findMany({
    where:   { active: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  })
  return reply.send(projects)
}

// ============================================================
// GET /api/projects/:slug — Público: projeto por slug
// ============================================================
export async function getProjectBySlug(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { slug } = req.params as { slug: string }
  const project  = await prisma.project.findUnique({ where: { slug } })
  if (!project) return reply.status(404).send({ error: 'Projeto não encontrado.' })
  return reply.send(project)
}

// ============================================================
// GET /api/projects/all — Admin: todos (incluindo inativos)
// ============================================================
export async function getAllProjects(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const projects = await prisma.project.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  })
  return reply.send(projects)
}

// ============================================================
// POST /api/projects — Admin: criar projeto
// ============================================================
export async function createProject(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const body = req.body as {
    title:            string
    slug?:            string
    shortDescription: string
    fullDescription?: string
    image?:           string
    images?:          unknown[]
    tags?:            string[]
    categories?:      string[]
    featured?:        boolean
    highlight?:       string
    linkDemo?:        string
    linkGithub?:      string
    linkGithubFront?: string
    linkGithubBack?:  string
    status?:          string
    order?:           number
    active?:          boolean
  }

  if (!body.title || !body.shortDescription) {
    return reply.status(400).send({ error: 'Título e descrição curta são obrigatórios.' })
  }

  const slug = body.slug
    ? slugify(body.slug,  { lower: true, strict: true })
    : slugify(body.title, { lower: true, strict: true })

  // Verifica slug duplicado
  const existing = await prisma.project.findUnique({ where: { slug } })
  if (existing) {
    return reply.status(409).send({ error: `Slug "${slug}" já existe.` })
  }

  const project = await prisma.project.create({
    data: {
      title:            body.title,
      slug,
      shortDescription: body.shortDescription,
      fullDescription:  body.fullDescription  ?? '',
      image:            body.image,
      images:           body.images           ?? [],
      tags:             body.tags             ?? [],
      categories:       body.categories       ?? [],
      featured:         body.featured         ?? false,
      highlight:        body.highlight,
      linkDemo:         body.linkDemo,
      linkGithub:       body.linkGithub,
      linkGithubFront:  body.linkGithubFront,
      linkGithubBack:   body.linkGithubBack,
      status:           body.status           ?? 'active',
      order:            body.order            ?? 0,
      active:           body.active           ?? true,
    },
  })

  return reply.status(201).send(project)
}

// ============================================================
// PUT /api/projects/:id — Admin: atualizar projeto
// ============================================================
export async function updateProject(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { id } = req.params as { id: string }
  const body   = req.body as Partial<{
    title:            string
    slug:             string
    shortDescription: string
    fullDescription:  string
    image:            string
    images:           unknown[]
    tags:             string[]
    categories:       string[]
    featured:         boolean
    highlight:        string
    linkDemo:         string
    linkGithub:       string
    linkGithubFront:  string
    linkGithubBack:   string
    status:           string
    order:            number
    active:           boolean
  }>

  const existing = await prisma.project.findUnique({ where: { id } })
  if (!existing) return reply.status(404).send({ error: 'Projeto não encontrado.' })

  // Se slug mudou, verifica conflito
  if (body.slug && body.slug !== existing.slug) {
    const slugConflict = await prisma.project.findUnique({ where: { slug: body.slug } })
    if (slugConflict) {
      return reply.status(409).send({ error: `Slug "${body.slug}" já existe.` })
    }
  }

  const project = await prisma.project.update({
    where: { id },
    data:  body,
  })

  return reply.send(project)
}

// ============================================================
// DELETE /api/projects/:id — Admin: deletar projeto
// ============================================================
export async function deleteProject(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { id } = req.params as { id: string }
  const existing = await prisma.project.findUnique({ where: { id } })
  if (!existing) return reply.status(404).send({ error: 'Projeto não encontrado.' })

  await prisma.project.delete({ where: { id } })
  return reply.send({ message: 'Projeto deletado com sucesso!' })
}

// ============================================================
// PATCH /api/projects/:id/order — Admin: reordenar
// ============================================================
export async function updateProjectOrder(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { id }    = req.params as { id: string }
  const { order } = req.body as { order: number }

  await prisma.project.update({ where: { id }, data: { order } })
  return reply.send({ message: 'Ordem atualizada.' })
}
