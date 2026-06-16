import { createClient } from '@supabase/supabase-js'

// Variáveis já carregadas pelo server.ts via import 'dotenv/config'
const supabaseUrl        = process.env.SUPABASE_URL        ?? ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

export const BUCKET = 'portfolio-cms'

// ============================================================
// Garante que o bucket existe e é público
// ============================================================
export async function ensureBucket(): Promise<void> {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('⚠️  Supabase não configurado — storage desabilitado.')
    return
  }

  const { error } = await supabase.storage.createBucket(BUCKET, {
    public:        true,
    fileSizeLimit: 52_428_800, // 50 MB
    allowedMimeTypes: [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
      'image/gif',  'image/heic', 'image/heif',
      'application/pdf',
    ],
  })

  if (error && !error.message.toLowerCase().includes('already exists')) {
    console.warn(`⚠️  Aviso ao criar bucket "${BUCKET}":`, error.message)
  }
}

// ============================================================
// Upload de buffer para o Storage
// ============================================================
export async function uploadToStorage(
  path: string,
  file: Buffer,
  mimeType: string
): Promise<string> {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: mimeType, upsert: true })

  if (error) throw new Error(`Supabase Storage: ${error.message}`)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

// ============================================================
// Delete arquivo do Storage
// ============================================================
export async function deleteFromStorage(path: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) throw new Error(`Erro ao deletar arquivo do Storage: ${error.message}`)
}
