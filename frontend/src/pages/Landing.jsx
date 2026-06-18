import { useNavigate } from 'react-router-dom'

export default function Landing() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-[#fdf6f0]">

            {/* NAVBAR */}
            <nav className="flex justify-between items-center px-8 py-1 bg-white shadow-sm max-h-16">
                <div className="flex items-center gap-1">
                    <img src="/src/assets/bloom_flor.png" alt="Bloom" className="h-12 w-12 object-contain" />
                    <span className="text-2xl font-bold text-[#2d1b4e]" style={{ fontFamily: 'Georgia, serif' }}>Bloom</span>
                </div>
                <div className="flex gap-6 text-[#2d1b4e] font-medium">
                    <a href="/feed">Feed</a>
                    <a href="/profile">Mi perfil</a>
                    <a href="#">Sobre nosotras</a>
                </div>
                <button
                    onClick={() => navigate('/login')}
                    className="bg-[#7c3aed] text-white px-5 py-2 rounded-full font-semibold hover:bg-[#6d28d9]"
                >
                    Entrar
                </button>
            </nav>

            {/* HERO */}
            <section className="flex flex-col md:flex-row items-center justify-between px-12 py-20 gap-10">
                <div className="max-w-xl">
                    <h1 className="text-5xl font-bold text-[#2d1b4e] leading-tight mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                        Existimos para que las mujeres florezcan en su nueva etapa profesional.
                    </h1>
                    <p className="text-gray-600 text-lg mb-8">
                        Queremos que nuestra comunidad encuentre inspiración, conexiones reales y el coraje para reinventarse.
                    </p>
                    <button
                        onClick={() => navigate('/register')}
                        className="bg-[#7c3aed] text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-[#6d28d9]"
                    >
                        Unete a Bloom
                    </button>
                </div>
                <div className="flex gap-4 relative">
                    <div className="relative">
                        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=400&fit=crop" alt="mujer profesional" className="rounded-2xl w-48 h-64 object-cover shadow-lg" />
                        <span className="absolute bottom-4 left-2 bg-[#7c3aed] text-white text-xs px-3 py-1 rounded-full writing-mode-vertical">Cambio de carrera</span>
                    </div>
                    <div className="relative mt-8">
                        <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=400&fit=crop" alt="mujer profesional" className="rounded-2xl w-48 h-64 object-cover shadow-lg" />
                        <span className="absolute bottom-4 left-2 bg-[#7c3aed] text-white text-xs px-3 py-1 rounded-full">Tech</span>
                    </div>
                    <div className="relative">
                        <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&h=400&fit=crop" alt="mujer profesional" className="rounded-2xl w-48 h-64 object-cover shadow-lg" />
                        <span className="absolute bottom-4 left-2 bg-[#7c3aed] text-white text-xs px-3 py-1 rounded-full">Emprendedora</span>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="bg-white py-20 px-12">
                <h2 className="text-3xl font-bold text-center text-[#2d1b4e] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                    Todo lo que necesitas para florecer
                </h2>
                <p className="text-center text-gray-500 mb-12">Una plataforma pensada para acompañarte en cada paso de tu reinvención profesional.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "Comparte tu historia", desc: "Publica tus logros, dudas y aprendizajes con una comunidad que te entiende." },
                        { title: "Conecta con mujeres", desc: "Encuentra tu comunidad de apoyo y crece junto a quienes también se reinventan." },
                        { title: "Reinventate", desc: "Inspi­rate en historias reales de transformación y da el salto que mereces." }
                    ].map((f, i) => (
                        <div key={i} className="bg-[#fdf6f0] rounded-2xl p-8 text-center shadow-sm">
                            <span className="text-4xl mb-4 block">{f.icon}</span>
                            <h3 className="text-xl font-bold text-[#2d1b4e] mb-3">{f.title}</h3>
                            <p className="text-gray-500">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="py-20 px-12 bg-[#fdf6f0]">
                <h2 className="text-3xl font-bold text-center text-[#2d1b4e] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                    Historias que inspiran
                </h2>
                <p className="text-center text-gray-500 mb-12">"Mujeres como tú que ya dieron el salto. Léelas, inspírate, únete."</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {[
                        { quote: "Bloom me dio el empuje que necesitaba para dar el salto a tech.", name: "Sandra", age: "35 Años Chile" },
                        { quote: "Encontré mi comunidad y mi nuevo camino profesional.", name: "Sara", age: "34 años León" }
                    ].map((t, i) => (
                        <div key={i} className="bg-white rounded-2xl p-8 shadow-sm">
                            <p className="text-[#2d1b4e] text-lg italic mb-6">"{t.quote}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 font-bold">
                                    {t.name[0]}
                                </div>
                                <div>
                                    <p className="font-bold text-[#2d1b4e]">{t.name}</p>
                                    <p className="text-gray-400 text-sm">{t.age}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-[#f3e8ff] py-20 px-12 text-center">
                <h2 className="text-4xl font-bold text-[#2d1b4e] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                    ¿Lista para florecer?
                </h2>
                <p className="text-gray-600 mb-8">Únete a miles de mujeres que ya están reinventando su carrera.</p>
                <button
                    onClick={() => navigate('/register')}
                    className="bg-[#7c3aed] text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-[#6d28d9]"
                >
                    Empieza ahora
                </button>
            </section>

            {/* FOOTER */}
            <footer className="bg-white px-12 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="flex items-center gap-1 mb-2">
                            <img src="/src/assets/bloom_flor.png" alt="Bloom" className="h-8 w-8 object-contain" />
                            <p className="text-xl font-bold text-[#2d1b4e]">Bloom</p>
                        </div>
                        <p className="text-gray-500 text-sm">Una comunidad para mujeres que se reinventan.</p>
                        <div className="flex gap-3 mt-4 text-gray-400">
                            <img src="/src/assets/bloom_flor.png" alt="Bloom" className="h-16 w-16 object-contain mx-auto mb-4" />
                        </div>
                    </div>
                    <div>
                        <p className="font-bold text-[#2d1b4e] mb-3">Plataforma</p>
                        <div className="flex flex-col gap-2 text-gray-500 text-sm">
                            <a href="/feed">Feed</a>
                            <a href="/profile">Mi perfil</a>
                            <a href="/register">Únete a Bloom</a>
                        </div>
                    </div>
                    <div>
                        <p className="font-bold text-[#2d1b4e] mb-3">Nosotras</p>
                        <div className="flex flex-col gap-2 text-gray-500 text-sm">
                            <a href="#">Sobre Bloom</a>
                            <a href="#">Contacto</a>
                            <a href="#">Blog</a>
                        </div>
                    </div>
                    <div>
                        <p className="font-bold text-[#2d1b4e] mb-3">Legal</p>
                        <div className="flex flex-col gap-2 text-gray-500 text-sm">
                            <a href="#">Política de privacidad</a>
                            <a href="#">Términos de uso</a>
                            <a href="#">Cookies</a>
                        </div>
                    </div>
                </div>
                <p className="text-center text-gray-400 text-sm border-t pt-6">
                    © 2025 Bloom. Hecho con amor para mujeres que florecen.
                </p>
            </footer>

        </div>
    )
}
