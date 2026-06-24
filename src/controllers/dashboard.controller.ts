import type { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../lib/prisma'

// Conta imagens em campos JSON do tipo [{src,alt}][]
// Retorna o número de objetos dentro dos arrays JSON de um conjunto de registros.
function countJsonImages(rows: { images: unknown }[]): number {
  let total = 0
  for (const row of rows) {
    if (Array.isArray(row.images)) total += row.images.length
  }
  return total
}

// ============================================================
// GET /api/dashboard/stats — Admin
// ============================================================
export async function getDashboardStats(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const [
    totalProjects,
    featuredProjects,
    totalCertifications,
    totalSkills,
    totalServices,
    totalClients,
    featuredClients,
    totalFeedbacks,
    totalLeads,
    newLeads,
    // Para o contador melhorado de mídias
    totalMediaTable,
    projectsWithImages,
    clientsWithImages,
    recentProjects,
    recentLeads,
    recentMedia,
  ] = await Promise.all([
    prisma.project.count({ where: { active: true } }),
    prisma.project.count({ where: { featured: true, active: true } }),
    prisma.certification.count({ where: { active: true } }),
    prisma.skill.count({ where: { active: true } }),
    prisma.servicePlan.count({ where: { active: true } }),
    prisma.client.count({ where: { active: true } }),
    prisma.client.count({ where: { featured: true, active: true } }),
    prisma.feedback.count({ where: { active: true } }),
    prisma.lead.count({ where: { archived: false } }),
    prisma.lead.count({ where: { status: 'novo', archived: false } }),
    // Registros na tabela media (uploads reais)
    prisma.media.count(),
    // Projetos: image (capa) + cada item em images[]
    prisma.project.findMany({
      select: { image: true, images: true },
    }),
    // Clientes: image (capa) + cada item em images[]
    prisma.client.findMany({
      select: { image: true, images: true },
    }),
    prisma.project.findMany({
      where:   { active: true },
      orderBy: { updatedAt: 'desc' },
      take:    5,
      select:  { id: true, title: true, slug: true, featured: true, updatedAt: true },
    }),
    prisma.lead.findMany({
      where:   { archived: false },
      orderBy: { createdAt: 'desc' },
      take:    5,
      select:  { id: true, name: true, email: true, status: true, createdAt: true },
    }),
    prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
      take:    6,
      select:  { id: true, originalName: true, url: true, mimeType: true, size: true, createdAt: true },
    }),
  ])

  // Contador de imagens de projetos:
  // - 1 por project.image não nulo
  // - + quantidade de itens em project.images[]
  const projectImageCount =
    projectsWithImages.filter((p: { image: string | null }) => p.image).length +
    countJsonImages(projectsWithImages as { images: unknown }[])

  // Contador de imagens de clientes:
  const clientImageCount =
    clientsWithImages.filter((c: { image: string | null }) => c.image).length +
    countJsonImages(clientsWithImages as { images: unknown }[])

  // Total consolidado de imagens em uso no portfólio
  const totalMedia = totalMediaTable + projectImageCount + clientImageCount

  return reply.send({
    totals: {
      projects:        totalProjects,
      featuredProjects,
      certifications:  totalCertifications,
      skills:          totalSkills,
      services:        totalServices,
      clients:         totalClients,
      featuredClients,
      feedbacks:       totalFeedbacks,
      media:           totalMedia,
      leads:           totalLeads,
      newLeads,
    },
    recentProjects,
    recentLeads,
    recentMedia,
  })
}