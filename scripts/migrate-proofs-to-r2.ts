import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

function loadEnv() {
  try {
    const lines = readFileSync('.env.local', 'utf8').split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const value = trimmed.slice(eqIdx + 1).trim()
      if (key && !(key in process.env)) process.env[key] = value
    }
  } catch { /* use existing env */ }
}

loadEnv()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL!
const R2_BUCKET = process.env.R2_BUCKET_NAME!

type ProofRow = {
  submission_id: string
  storage_path: string
  mime_type: string
}

async function migrate() {
  console.log('Fetching unmigrated proofs...')

  const { data: proofs, error } = await supabase
    .from('submission_proofs')
    .select('submission_id, storage_path, mime_type')
    .not('storage_path', 'like', 'https://%')

  if (error) {
    console.error('Failed to fetch proofs:', error.message)
    process.exit(1)
  }

  const rows = (proofs ?? []) as ProofRow[]
  console.log(`Found ${rows.length} proof(s) to migrate\n`)

  if (!rows.length) {
    console.log('Nothing to migrate.')
    return
  }

  let success = 0
  let failed = 0

  for (const proof of rows) {
    try {
      const { data: signedData } = await supabase.storage
        .from('activity-proofs')
        .createSignedUrl(proof.storage_path, 3600)

      if (!signedData?.signedUrl) {
        console.error(`  [SKIP] ${proof.submission_id} — could not generate signed URL`)
        failed++
        continue
      }

      const imageResponse = await fetch(signedData.signedUrl)
      if (!imageResponse.ok) {
        console.error(`  [FAIL] ${proof.submission_id} — download failed: ${imageResponse.status}`)
        failed++
        continue
      }

      const body = Buffer.from(await imageResponse.arrayBuffer())

      await r2.send(new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: proof.storage_path,
        Body: body,
        ContentType: proof.mime_type,
        CacheControl: 'public, max-age=604800, immutable',
      }))

      const newUrl = `${R2_PUBLIC_URL}/${proof.storage_path}`

      const { error: updateError } = await supabase
        .from('submission_proofs')
        .update({ storage_path: newUrl })
        .eq('submission_id', proof.submission_id)

      if (updateError) {
        console.error(`  [FAIL] ${proof.submission_id} — DB update failed: ${updateError.message}`)
        failed++
        continue
      }

      console.log(`  [OK] ${proof.submission_id} → ${newUrl}`)
      success++
    } catch (err) {
      console.error(`  [FAIL] ${proof.submission_id} — unexpected error:`, err)
      failed++
    }
  }

  console.log(`\nDone. ${success} migrated, ${failed} failed.`)
}

migrate()
