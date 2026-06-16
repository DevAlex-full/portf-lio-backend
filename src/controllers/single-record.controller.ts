import type { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../lib/prisma'

// ============================================================
// HERO
// ============================================================
export async function getHero(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  let hero = await prisma.hero.findFirst()
  if (!hero) {
    hero = await prisma.hero.create({ data: {} })
  }
  return reply.send(hero)
}

export async function updateHero(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const body = req.body as Partial<{
    name: string; role: string; description: string; photoUrl: string
    cvUrl: string; githubUrl: string; linkedinUrl: string
    emailAddress: string; whatsapp: string; typingSvgUrl: string; available: boolean
  }>

  let hero = await prisma.hero.findFirst()

  if (hero) {
    hero = await prisma.hero.update({ where: { id: hero.id }, data: body })
  } else {
    hero = await prisma.hero.create({ data: body })
  }

  return reply.send(hero)
}

// ============================================================
// ABOUT
// ============================================================
export async function getAbout(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  let about = await prisma.about.findFirst()
  if (!about) {
    about = await prisma.about.create({ data: {} })
  }
  return reply.send(about)
}

export async function updateAbout(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const body = req.body as Partial<{
    paragraph1: string; paragraph2: string; paragraph3: string; highlights: unknown
  }>

  let about = await prisma.about.findFirst()

  if (about) {
    about = await prisma.about.update({ where: { id: about.id }, data: body })
  } else {
    about = await prisma.about.create({ data: body })
  }

  return reply.send(about)
}

// ============================================================
// CONTACT
// ============================================================
export async function getContact(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  let contact = await prisma.contact.findFirst()
  if (!contact) {
    contact = await prisma.contact.create({ data: {} })
  }
  return reply.send(contact)
}

export async function updateContact(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const body = req.body as Partial<{
    whatsapp: string; email: string; location: string
    github: string; githubUrl: string; linkedin: string; linkedinUrl: string
    instagram: string; instagramUrl: string; defaultMessage: string
  }>

  let contact = await prisma.contact.findFirst()

  if (contact) {
    contact = await prisma.contact.update({ where: { id: contact.id }, data: body })
  } else {
    contact = await prisma.contact.create({ data: body })
  }

  return reply.send(contact)
}

// ============================================================
// SITE SETTINGS
// ============================================================
export async function getSettings(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  let settings = await prisma.siteSettings.findFirst()
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: {} })
  }
  return reply.send(settings)
}

export async function updateSettings(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const body = req.body as Partial<{
    siteTitle: string; description: string; keywords: string[]
    ogTitle: string; ogDescription: string; faviconUrl: string; logoUrl: string
  }>

  let settings = await prisma.siteSettings.findFirst()

  if (settings) {
    settings = await prisma.siteSettings.update({ where: { id: settings.id }, data: body })
  } else {
    settings = await prisma.siteSettings.create({ data: body })
  }

  return reply.send(settings)
}
