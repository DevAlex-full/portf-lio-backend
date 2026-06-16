import type { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../lib/prisma'
import { uploadToStorage, deleteFromStorage, ensureBucket } from '../lib/supabase'

const ALLOWED_MIME = [
  'image/jpeg', 'image/jpg', 'image/png',
  'image/webp', 'image/gif', 'image/heic', 'image/heif',
  'application/pdf',
]

// ============================================================
// POST /api/media — Upload único
// ============================================================
export async function uploadMedia(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const data = await req.file()
  if (!data) {
    return reply.status(400).send({ error: 'Nenhum arquivo enviado.' })
  }

  if (!ALLOWED_MIME.includes(data.mimetype)) {
    return reply.status(400).send({
      error: `Tipo não suportado: ${data.mimetype}. Use JPG, PNG, WebP, GIF ou PDF.`,
    })
  }

  await ensureBucket()

  const buffer   = await data.toBuffer()
  const ext      = (data.filename.split('.').pop() ?? 'jpg').toLowerCase()
  const folder   = data.mimetype === 'application/pdf' ? 'pdfs' : 'images'
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`

  const url = await uploadToStorage(fileName, buffer, data.mimetype)

  const media = await prisma.media.create({
    data: {
      fileName,
      originalName: data.filename,
      url,
      mimeType: data.mimetype,
      size:     buffer.length,
      path:     fileName,
    },
  })

  return reply.status(201).send(media)
}

// ============================================================
// POST /api/media/batch — Upload múltiplo
// ============================================================
export async function uploadMediaBatch(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  await ensureBucket()

  const results: Array<{ success: boolean; media?: unknown; error?: string; name: string }> = []

  for await (const part of req.files()) {
    if (!ALLOWED_MIME.includes(part.mimetype)) {
      results.push({ success: false, name: part.filename, error: `Tipo não suportado: ${part.mimetype}` })
      continue
    }

    try {
      const buffer   = await part.toBuffer()
      const ext      = (part.filename.split('.').pop() ?? 'jpg').toLowerCase()
      const folder   = part.mimetype === 'application/pdf' ? 'pdfs' : 'images'
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`

      const url = await uploadToStorage(fileName, buffer, part.mimetype)

      const media = await prisma.media.create({
        data: {
          fileName,
          originalName: part.filename,
          url,
          mimeType: part.mimetype,
          size:     buffer.length,
          path:     fileName,
        },
      })

      results.push({ success: true, name: part.filename, media })
    } catch (err) {
      results.push({
        success: false,
        name:    part.filename,
        error:   err instanceof Error ? err.message : 'Erro desconhecido',
      })
    }
  }

  const ok   = results.filter(r => r.success)
  const fail = results.filter(r => !r.success)

  return reply.send({
    message: `${ok.length} de ${results.length} arquivo(s) enviado(s) com sucesso.`,
    results,
    total: results.length, sucesso: ok.length, falhas: fail.length,
  })
}

// ============================================================
// GET /api/media — Listar (paginado)
// ============================================================
export async function listMedia(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { page = '1', limit = '24', search = '' } = req.query as {
    page?: string; limit?: string; search?: string
  }

  const take = Math.min(Number(limit), 100)
  const skip = (Number(page) - 1) * take

  const where = search
    ? { OR: [
        { originalName: { contains: search, mode: 'insensitive' as const } },
        { fileName:     { contains: search, mode: 'insensitive' as const } },
      ]}
    : {}

  const [items, total] = await Promise.all([
    prisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.media.count({ where }),
  ])

  return reply.send({
    items,
    total,
    page:       Number(page),
    totalPages: Math.ceil(total / take),
  })
}

// ============================================================
// DELETE /api/media/:id
// ============================================================
export async function deleteMedia(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { id } = req.params as { id: string }

  const media = await prisma.media.findUnique({ where: { id } })
  if (!media) {
    return reply.status(404).send({ error: 'Arquivo não encontrado.' })
  }

  await deleteFromStorage(media.path)
  await prisma.media.delete({ where: { id } })

  return reply.send({ message: 'Arquivo deletado com sucesso!' })
}
