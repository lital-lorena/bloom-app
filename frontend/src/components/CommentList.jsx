import { useState } from 'react'

const PURPLE = "#8C52FF"
const PLUM = "#3D2B1F"
const GRAY = "#9CA3AF"
const LAVENDER = "#F3EEFF"

function Avatar({ name, foto = null }) {
  const letter = (name || "?").trim().charAt(0).toUpperCase()
  return foto ? (
    <img src={foto} alt={name} className="h-9 w-9 flex-none rounded-full object-cover" />
  ) : (
    <div
      className="flex h-9 w-9 flex-none items-center justify-center rounded-full font-serif text-sm font-semibold"
      style={{ backgroundColor: LAVENDER, color: PURPLE }}
    >
      {letter}
    </div>
  )
}

export default function CommentList({ postId, comentarios = [], token, userId, onCommentsChange }) {
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState("")
  const [error, setError] = useState("")

  const isOwner = (comment) =>
    userId && String(comment.autora.id) === String(userId)

  const handleDelete = async (commentId) => {
    setError("")
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/comments/item/${commentId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (response.ok) {
        const updated = comentarios.filter((c) => Number(c.id) !== Number(commentId))
        onCommentsChange(postId, updated)
      } else {
        const data = await response.json().catch(() => ({}))
        setError(data.error || "No se pudo borrar el comentario.")
      }
    } catch {
      setError("No se pudo conectar con el servidor. Reinicia Flask (python run.py) e inténtalo de nuevo.")
    }
  }

  const handleSaveEdit = async (commentId) => {
    if (!editText.trim()) {
      setError("El comentario no puede estar vacío.")
      return
    }

    setError("")
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/comments/item/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ contenido: editText.trim() })
      })

      const data = await response.json().catch(() => ({}))

      if (response.ok) {
        const updated = comentarios.map((c) =>
          Number(c.id) === Number(commentId) ? data : c
        )
        setEditingId(null)
        setEditText("")
        onCommentsChange(postId, updated)
      } else {
        const msg =
          response.status === 404 || response.status === 405
            ? "El servidor no tiene la ruta de edición activa. Reinicia Flask (python run.py)."
            : data.error || data.msg || "No se pudo guardar el comentario."
        setError(msg)
      }
    } catch {
      setError("No se pudo conectar con el servidor. Reinicia Flask (python run.py) e inténtalo de nuevo.")
    }
  }

  if (comentarios.length === 0) {
    return (
      <p className="py-2 text-center text-sm" style={{ color: GRAY }}>
        Aún no hay comentarios.
      </p>
    )
  }

  return (
    <>
      {error && !editingId && (
        <p className="mb-2 text-sm text-red-500">{error}</p>
      )}
      {comentarios.map((c) => (
        <div key={c.id} className="flex items-start gap-2">
          <Avatar name={c.autora.nombre} foto={c.autora.avatar} />
          <div className="min-w-0 flex-1">
            {Number(editingId) === Number(c.id) ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-[#8C52FF]"
                  style={{ color: PLUM }}
                />
                {error && Number(editingId) === Number(c.id) && (
                  <p className="text-sm text-red-500">{error}</p>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveEdit(c.id)}
                    className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                    style={{ backgroundColor: PURPLE }}
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditingId(null); setEditText(""); setError("") }}
                    className="rounded-full px-3 py-1 text-xs font-medium hover:bg-black/5"
                    style={{ color: GRAY }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="rounded-xl px-3 py-2 text-sm" style={{ backgroundColor: LAVENDER, color: PLUM }}>
                  <span className="font-semibold" style={{ color: PURPLE }}>{c.autora.nombre} </span>
                  {c.contenido}
                </div>
                {token && isOwner(c) && (
                  <div className="mt-1 flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(c.id)
                        setEditText(c.contenido)
                        setError("")
                      }}
                      className="text-xs font-medium hover:opacity-80"
                      style={{ color: PURPLE }}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      className="text-xs font-medium hover:opacity-80 text-red-400"
                    >
                      Borrar
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </>
  )
}
