import type { FastifyRequest, FastifyReply } from 'fastify'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'

// ============================================================
// POST /api/auth/login
// ============================================================
export async function login(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { email, password } = req.body as { email?: string; password?: string }

  if (!email || !password) {
    return reply.status(400).send({ error: 'Email e senha são obrigatórios.' })
  }

  const admin = await prisma.admin.findUnique({ where: { email } })

  if (!admin) {
    return reply.status(401).send({ error: 'Credenciais inválidas.' })
  }

  const valid = await bcrypt.compare(password, admin.password)
  if (!valid) {
    return reply.status(401).send({ error: 'Credenciais inválidas.' })
  }

  const token = req.server.jwt.sign(
    { id: admin.id, email: admin.email },
    { expiresIn: '7d' }
  )

  return reply.send({
    message: 'Login realizado com sucesso!',
    token,
    admin: { id: admin.id, email: admin.email, name: admin.name },
  })
}

// ============================================================
// GET /api/auth/me
// ============================================================
export async function me(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const user = req.user as { id: string }

  const admin = await prisma.admin.findUnique({
    where:  { id: user.id },
    select: { id: true, email: true, name: true, createdAt: true },
  })

  if (!admin) {
    return reply.status(404).send({ error: 'Admin não encontrado.' })
  }

  return reply.send({ admin })
}

// ============================================================
// POST /api/auth/change-password
// ============================================================
export async function changePassword(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { currentPassword, newPassword } = req.body as {
    currentPassword?: string
    newPassword?: string
  }
  const user = req.user as { id: string }

  if (!currentPassword || !newPassword) {
    return reply.status(400).send({ error: 'Senha atual e nova senha são obrigatórias.' })
  }

  if (newPassword.length < 8) {
    return reply.status(400).send({ error: 'Nova senha deve ter no mínimo 8 caracteres.' })
  }

  const admin = await prisma.admin.findUnique({ where: { id: user.id } })
  if (!admin) {
    return reply.status(404).send({ error: 'Admin não encontrado.' })
  }

  const valid = await bcrypt.compare(currentPassword, admin.password)
  if (!valid) {
    return reply.status(401).send({ error: 'Senha atual incorreta.' })
  }

  const hash = await bcrypt.hash(newPassword, 12)
  await prisma.admin.update({ where: { id: user.id }, data: { password: hash } })

  return reply.send({ message: 'Senha alterada com sucesso!' })
}
