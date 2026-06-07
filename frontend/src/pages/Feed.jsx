import { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'



function Feed() {

  const [posts, setPosts] = useState([])

  useEffect(()=>{
    const fetchPost = async()=>{
      const response = await fetch("http://127.0.0.1:5000/api/posts")
      const data = await response.json()
      setPosts(data)  
    }

    fetchPost()
    
  },[])
  return (
    <div className="min-h-screen bg-[#FDFAF6] px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[#3D2B1F] mb-6">Feed 🌸</h1>
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl border border-[#E5E7EB] p-5 mb-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
            <p className="text-sm font-semibold text-[#8C52FF] mb-2">{post.autora.nombre}</p>
            <p className="text-[#3D2B1F] text-base">{post.texto}</p>
            <p className="text-xs text-[#9CA3AF] mt-3">{new Date(post.fecha).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
  }
  
  export default Feed