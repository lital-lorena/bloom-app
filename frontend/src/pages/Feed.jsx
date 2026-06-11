import { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'

function Feed() {

  const [posts, setPosts] = useState([])
  const [text, setText] = useState("")
  const { token, user } = useUser()
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState("")

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch("http://127.0.0.1:5000/api/posts")
      const data = await response.json()
      setPosts(data)
    }
    fetchPost()
  }, [])

  const handleCreatePost = async (e) => {
    e.preventDefault()
    const response = await fetch("http://127.0.0.1:5000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ texto: text })
    })
    const data = await response.json()
    console.log(data)

    if (response.ok) {
      setText("")
      const updatedResponse = await fetch("http://127.0.0.1:5000/api/posts")
      const updatedPosts = await updatedResponse.json()
      setPosts(updatedPosts)
    }
  }

  const handleDeletePost = async (postId) => {
    const response = await fetch(`http://127.0.0.1:5000/api/posts/${postId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    if (response.ok) {
      setPosts(posts.filter((post) => post.id !== postId))
    }
  }

  const handleEditPost = async (postId) => {
    const response = await fetch(`http://127.0.0.1:5000/api/posts/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ texto: editText })
    })

    if (response.ok) {
      setPosts(posts.map((post) =>
        post.id === postId ? { ...post, texto: editText } : post
      ))
      setEditingId(null)
      setEditText("")
    }
  }

  console.log("posts:", posts)
  console.log("user:", user)

  return (
    <div className="min-h-screen bg-[#FDFAF6] px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[#3D2B1F] mb-6">Feed 🌸</h1>

        <form onSubmit={handleCreatePost} className="bg-white rounded-xl border border-[#E5E7EB] p-5 mb-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="¿Qué quieres compartir hoy? 🌸"
            className="w-full border border-[#E5E7EB] rounded-lg p-3 text-[#3D2B1F] placeholder:text-[#9CA3AF] resize-none"
            rows={3}
          />
          <button
            type="submit"
            className="mt-3 bg-[#8C52FF] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#7440E8]"
          >
            Publicar
          </button>
        </form>

        {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl border border-[#E5E7EB] p-5 mb-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
              <p className="text-sm font-semibold text-[#8C52FF] mb-2">{post.autora.nombre}</p>

              {editingId === post.id ? (
                <div className="mt-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full border border-[#E5E7EB] rounded-lg p-3 text-[#3D2B1F] resize-none"
                    rows={3}
                  />
                  <button
                    onClick={() => handleEditPost(post.id)}
                    className="mt-2 text-sm bg-[#8C52FF] text-white px-4 py-1 rounded-lg"
                  >
                    Guardar
                  </button>
                </div>
              ) : (
                <p className="text-[#3D2B1F] text-base">{post.texto}</p>
              )}

              <p className="text-xs text-[#9CA3AF] mt-3">{new Date(post.fecha).toLocaleDateString()}</p>

              {user && String(post.autora.id) === String(user.id) && (
                <div className="mt-2 flex gap-3">
                  {editingId !== post.id && (
                    <button
                      onClick={() => {
                        setEditingId(post.id)
                        setEditText(post.texto)
                      }}
                      className="text-sm text-[#8C52FF] hover:text-[#7440E8]"
                    >
                      Editar
                    </button>
                  )}
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="text-sm text-red-400 hover:text-red-600"
                  >
                    Borrar
                  </button>
                </div>
              )}
            </div>
        ))}

      </div>
    </div>
  )
}

export default Feed