import type { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../lib/prisma'

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
    totalMedia,
    totalLeads,
    newLeads,
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
    prisma.media.count(),
    prisma.lead.count({ where: { archived: false } }),
    prisma.lead.count({ where: { status: 'novo', archived: false } }),
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

  return reply.send({
    totals: {
      projects:        totalProjects,
      featuredProjects,
      certifications:  totalCertifications,
      skills:          totalSkills,
      services:        totalServices,
      clients:         totalClients,
      featuredClients,
      media:           totalMedia,
      leads:           totalLeads,
      newLeads,
    },
    recentProjects,
    recentLeads,
    recentMedia,
  })
}