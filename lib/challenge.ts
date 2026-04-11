export type DistanceUnit = 'MI' | 'KM'

export const KM_TO_MILES = 0.621371
export const MAX_DISTANCE_MILES = 200

export const PROOF_BUCKET = 'activity-proofs'
export const MAX_PROOF_FILE_BYTES = 10 * 1024 * 1024

export const ALLOWED_PROOF_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const

const MIME_TO_EXTENSION: Record<(typeof ALLOWED_PROOF_MIME_TYPES)[number], string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export function convertToMiles(distance: number, unit: DistanceUnit) {
  return unit === 'KM' ? distance * KM_TO_MILES : distance
}

export function isAllowedProofMimeType(mimeType: string) {
  return ALLOWED_PROOF_MIME_TYPES.includes(mimeType as (typeof ALLOWED_PROOF_MIME_TYPES)[number])
}

export function getProofExtension(mimeType: string) {
  return MIME_TO_EXTENSION[mimeType as keyof typeof MIME_TO_EXTENSION] ?? 'bin'
}

export function formatProofPath(userId: string, mimeType: string) {
  return `${userId}/${Date.now()}-${crypto.randomUUID()}.${getProofExtension(mimeType)}`
}
