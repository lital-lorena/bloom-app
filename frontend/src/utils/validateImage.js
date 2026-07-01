// Validación de imágenes antes de subir a Cloudinary

export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
export const IMAGE_MAX_BYTES = 5 * 1024 * 1024
export const IMAGE_MAX_COUNT = 1

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"])
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"])

/**
 * Comprueba formato, tamaño y cantidad de una imagen seleccionada.
 * Devuelve { ok: true, file } o { ok: false, error }.
 */
export function validateImageFile(file, fileCount = 1) {
  if (fileCount > IMAGE_MAX_COUNT) {
    return { ok: false, error: "Solo puedes subir 1 imagen." }
  }

  if (!file) {
    return { ok: false, error: "No se seleccionó ninguna imagen." }
  }

  const ext = file.name.includes(".")
    ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase()
    : ""
  const mimeOk = ALLOWED_MIME.has(file.type)
  const extOk = ALLOWED_EXT.has(ext)

  if (!mimeOk && !extOk) {
    return { ok: false, error: "Solo se permiten imágenes JPG, PNG o WebP." }
  }

  if (file.size > IMAGE_MAX_BYTES) {
    return { ok: false, error: "La imagen no puede superar 5 MB." }
  }

  return { ok: true, file }
}
