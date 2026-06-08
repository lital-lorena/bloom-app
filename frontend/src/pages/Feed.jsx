import { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'



function Feed() {

  const [posts, setPosts] = useState([])
  const [text, setText] = useState("")
  const { token,user } = useUser()

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
        setPosts(posts.filter((post) => post.id != postId))
      }
    }



  
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
            <p className="text-[#3D2B1F] text-base">{post.texto}</p>
            <p className="text-xs text-[#9CA3AF] mt-3">{new Date(post.fecha).toLocaleDateString()}</p>
            {user && post.autora.id === user.id && (
              <button
                onClick={() => handleDeletePost(post.id)}
                className="mt-2 text-sm text-red-400 hover:text-red-600"
              >
                Borrar
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Feed