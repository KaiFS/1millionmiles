import {
  COMPRESSED_PROOF_MAX_DIMENSION,
  COMPRESSED_PROOF_MIME_TYPE,
  COMPRESSED_PROOF_QUALITY,
} from '@/lib/challenge'

function extensionForMimeType(mimeType: string) {
  if (mimeType === 'image/webp') return 'webp'
  if (mimeType === 'image/jpeg') return 'jpg'
  if (mimeType === 'image/png') return 'png'
  return 'bin'
}

function compressedFileName(fileName: string, mimeType: string) {
  const baseName = fileName.replace(/\.[^.]+$/, '')
  return `${baseName || 'proof'}-compressed.${extensionForMimeType(mimeType)}`
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    const url = URL.createObjectURL(file)

    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }

    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read proof image.'))
    }

    image.src = url
  })
}

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number) {
  return new Promise<Blob | null>(resolve => {
    canvas.toBlob(resolve, mimeType, quality)
  })
}

export async function compressProofImage(file: File) {
  const image = await loadImage(file)
  const scale = Math.min(
    1,
    COMPRESSED_PROOF_MAX_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight)
  )
  const width = Math.max(1, Math.round(image.naturalWidth * scale))
  const height = Math.max(1, Math.round(image.naturalHeight * scale))
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) return file

  canvas.width = width
  canvas.height = height
  context.drawImage(image, 0, 0, width, height)

  const qualityLevels = [COMPRESSED_PROOF_QUALITY, 0.62, 0.52]
  let smallestBlob: Blob | null = null

  for (const quality of qualityLevels) {
    const blob = await canvasToBlob(canvas, COMPRESSED_PROOF_MIME_TYPE, quality)
    if (!blob) continue
    if (!smallestBlob || blob.size < smallestBlob.size) {
      smallestBlob = blob
    }
  }

  if (!smallestBlob || smallestBlob.size >= file.size) {
    return file
  }

  return new File(
    [smallestBlob],
    compressedFileName(file.name, smallestBlob.type || COMPRESSED_PROOF_MIME_TYPE),
    {
      type: smallestBlob.type || COMPRESSED_PROOF_MIME_TYPE,
      lastModified: Date.now(),
    }
  )
}
