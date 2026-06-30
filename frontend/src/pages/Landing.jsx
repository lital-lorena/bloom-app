import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import BloomLogo from '../components/BloomLogo'
import BloomButton from '../components/BloomButton'
import UserMenu from '../components/UserMenu'
import NavAuthLinks from '../components/NavAuthLinks'
import heroImage from '../assets/hero.png'
import sandraPhoto from '../assets/testimonials/sandra.jpg'
import saraPhoto from '../assets/testimonials/sara.jpg'
import mariaPhoto from '../assets/testimonials/maria.jpg'

export default function Landing() {
    const navigate = useNavigate()
    const { token } = useUser()

    return (
        <div className="min-h-screen bg-white font-[family-name:var(--font-body)]">

            <nav className="fixed inset-x-4 top-4 z-50 flex items-center justify-between rounded-2xl border border-white/40 bg-white/85 px-5 py-2 shadow-lg backdrop-blur-sm md:inset-x-10 md:px-8 lg:inset-x-12">
                <a href="/" className="flex items-center">
                    <BloomLogo className="h-10 w-auto md:h-11" />
                </a>
                {token ? (
                    <UserMenu />
                ) : (
                    <BloomButton variant="nav" onClick={() => navigate('/login')}>
                        Entrar
                    </BloomButton>
                )}
            </nav>

            <section className="relative w-full">
                <div className="relative min-h-[32rem] w-full overflow-hidden md:min-h-[36rem] lg:min-h-[40rem]">
                    <img
                        src={heroImage}
                        alt="Mujeres profesionales en comunidad"
                        className="absolute inset-0 h-full w-full object-cover object-center"
                    />

                    <div
                        className="absolute inset-0 pointer-events-none"
                        aria-hidden="true"
                        style={{
                            background: `
                                radial-gradient(ellipse 85% 75% at 100% 0%, rgba(255, 90, 157, 0.88) 0%, rgba(255, 116, 135, 0.55) 35%, transparent 72%),
                                radial-gradient(ellipse 90% 80% at 0% 100%, rgba(255, 90, 157, 0.92) 0%, rgba(255, 138, 104, 0.6) 38%, transparent 75%)
                            `,
                        }}
                    />

                    <div className="relative z-10 flex min-h-[32rem] flex-col justify-end p-8 md:min-h-[36rem] md:p-12 lg:min-h-[40rem] lg:p-14">
                        <h1 className="font-title text-6xl tracking-tight text-white sm:text-7xl md:text-8xl lg:text-[7rem] lg:leading-none">
                            Bloom
                        </h1>
                        <p className="font-subtitle mt-3 max-w-md text-base font-medium text-white/95 sm:text-lg md:text-xl">
                            Todo lo que necesitas para florecer
                        </p>
                        {token ? (
                            <BloomButton variant="hero" className="mt-6" onClick={() => navigate('/feed')}>
                                Ir al Feed
                            </BloomButton>
                        ) : (
                            <BloomButton variant="hero" className="mt-6" showDot onClick={() => navigate('/register')}>
                                Unete
                            </BloomButton>
                        )}
                    </div>
                </div>
            </section>

            <section className="bg-white px-12 py-20">
                <h2 className="font-title mb-4 text-center text-3xl text-bloom-dark">
                    ¿Qué encontrarás en Bloom?
                </h2>
                <p className="mb-12 text-center text-bloom-gray">
                    Una plataforma pensada para acompañarte en cada paso de tu reinvención profesional.
                </p>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {[
                        { title: 'Comparte tu historia', desc: 'Publica tus logros, dudas y aprendizajes con una comunidad que te entiende.' },
                        { title: 'Conecta con mujeres', desc: 'Encuentra tu comunidad de apoyo y crece junto a quienes también se reinventan.' },
                        { title: 'Reinventate', desc: 'Inspirate en historias reales de transformación y da el salto que mereces.' },
                    ].map((f, i) => (
                        <div key={i} className="rounded-2xl border-2 border-bloom-pink bg-transparent p-8 text-center">
                            <h3 className="font-subtitle mb-3 text-xl text-bloom-dark">{f.title}</h3>
                            <p className="text-bloom-gray">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section
                className="px-12 py-20"
                style={{
                    background: 'linear-gradient(to bottom, #FFFFFF 0%, #FFF5F2 45%, #FFD4CC 100%)',
                }}
            >
                <h2 className="font-title mb-4 text-center text-3xl text-bloom-dark">
                    Historias que inspiran
                </h2>
                <p className="mb-12 text-center text-bloom-gray">
                    Mujeres como tú que ya dieron el salto. Léelas, inspírate, únete.
                </p>
                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
                    {[
                        { quote: 'Bloom me dio el empuje que necesitaba para dar el salto a tech.', name: 'Sandra', age: '35 años · Chile', photo: sandraPhoto },
                        { quote: 'Encontré mi comunidad y mi nuevo camino profesional.', name: 'Sara', age: '34 años · León', photo: saraPhoto },
                        { quote: 'Aquí nadie juzga tu pausa. Solo te ayudan a volver con más fuerza.', name: 'María', age: '42 años · Madrid', photo: mariaPhoto },
                    ].map((t, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center rounded-2xl bg-white/90 p-8 text-center shadow-[0_8px_32px_-4px_rgba(255,95,168,0.15)] backdrop-blur-sm"
                        >
                            <div className="mb-5 h-16 w-16 overflow-hidden rounded-full ring-2 ring-bloom-peach/50">
                                <img
                                    src={t.photo}
                                    alt={t.name}
                                    className="h-full w-full object-cover object-top"
                                />
                            </div>
                            <p className="font-subtitle mb-6 flex-1 text-base font-normal italic leading-relaxed text-bloom-dark md:text-lg">
                                &ldquo;{t.quote}&rdquo;
                            </p>
                            <div>
                                <p className="font-normal text-bloom-dark">{t.name}</p>
                                <p className="mt-1 text-sm text-bloom-gray">{t.age}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="px-6 py-12 md:px-12 md:py-16">
                <div
                    className="relative overflow-hidden rounded-[2.5rem] px-8 py-24 text-center md:rounded-[3.5rem] md:px-16 md:py-28"
                    style={{
                        backgroundColor: '#FFA58B',
                        backgroundImage: `
                            radial-gradient(ellipse 130% 110% at -5% -10%, #FF5FA8 0%, rgba(255, 95, 168, 0.72) 38%, transparent 72%),
                            radial-gradient(ellipse 110% 95% at 105% 45%, #FFC2A8 0%, rgba(255, 194, 168, 0.88) 42%, transparent 70%),
                            radial-gradient(ellipse 90% 80% at 35% 55%, #FF7E8A 0%, rgba(255, 126, 138, 0.45) 48%, transparent 75%),
                            radial-gradient(ellipse 75% 65% at 65% 15%, rgba(255, 165, 139, 0.75) 0%, transparent 58%),
                            radial-gradient(ellipse 85% 70% at 50% 100%, rgba(255, 194, 168, 0.55) 0%, transparent 62%)
                        `,
                        boxShadow: '0 24px 64px -12px rgba(255, 95, 168, 0.18)',
                    }}
                >
                    {/* Formas orgánicas decorativas */}
                    <svg
                        className="pointer-events-none absolute inset-0 h-full w-full"
                        viewBox="0 0 1200 400"
                        preserveAspectRatio="xMidYMid slice"
                        aria-hidden="true"
                    >
                        <g style={{ filter: 'blur(0.5px)' }}>
                            <path
                                d="M-80 90 C180 30, 380 150, 620 80 S1020 20, 1280 110"
                                stroke="white"
                                strokeWidth="52"
                                fill="none"
                                opacity="0.13"
                                strokeLinecap="round"
                            />
                            <path
                                d="M-60 260 C220 190, 420 310, 680 230 S1060 170, 1300 280"
                                stroke="white"
                                strokeWidth="40"
                                fill="none"
                                opacity="0.11"
                                strokeLinecap="round"
                            />
                            <path
                                d="M120 340 C340 280, 520 380, 760 300 S980 240, 1180 320"
                                stroke="white"
                                strokeWidth="28"
                                fill="none"
                                opacity="0.1"
                                strokeLinecap="round"
                            />
                        </g>
                    </svg>

                    <div className="relative z-10 mx-auto max-w-2xl">
                        <h2 className="font-title mb-5 text-4xl font-bold tracking-tight text-white md:text-5xl">
                            ¿Lista para florecer?
                        </h2>
                        <p className="mb-10 text-base font-light leading-relaxed text-white md:text-lg">
                            Únete a miles de mujeres que ya están reinventando su carrera.
                        </p>
                        <BloomButton variant="hero" showDot className="mx-auto text-base" onClick={() => navigate('/register')}>
                            Empieza ahora
                        </BloomButton>
                    </div>
                </div>
            </section>

            <footer className="bg-white px-12 py-12">
                <div className="mb-8 grid grid-cols-2 gap-8 md:grid-cols-4">
                    <div>
                        <BloomLogo className="mb-2 h-14 w-auto" />
                        <p className="text-sm text-bloom-gray">Una comunidad para mujeres que se reinventan.</p>
                    </div>
                    <div>
                        <p className="mb-3 font-semibold text-bloom-dark">Plataforma</p>
                        <div className="flex flex-col gap-2 text-sm text-bloom-gray">
                            {token && (
                                <NavAuthLinks className="flex-col items-start gap-2 [&_a]:text-sm [&_a]:text-bloom-gray [&_a]:hover:text-bloom-pink" />
                            )}
                            <a href="/register" className="hover:text-bloom-pink">Únete a Bloom</a>
                        </div>
                    </div>
                    <div>
                        <p className="mb-3 font-semibold text-bloom-dark">Nosotras</p>
                        <div className="flex flex-col gap-2 text-sm text-bloom-gray">
                            <a href="/sobre-bloom" className="hover:text-bloom-pink">Sobre Bloom</a>
                            <a href="#" className="hover:text-bloom-pink">Contacto</a>
                            <a href="#" className="hover:text-bloom-pink">Blog</a>
                        </div>
                    </div>
                    <div>
                        <p className="mb-3 font-semibold text-bloom-dark">Legal</p>
                        <div className="flex flex-col gap-2 text-sm text-bloom-gray">
                            <a href="#" className="hover:text-bloom-pink">Política de privacidad</a>
                            <a href="#" className="hover:text-bloom-pink">Términos de uso</a>
                            <a href="#" className="hover:text-bloom-pink">Cookies</a>
                        </div>
                    </div>
                </div>
                <p className="border-t pt-6 text-center text-sm text-bloom-gray">
                    © 2025 Bloom. Hecho con amor para mujeres que florecen.
                </p>
            </footer>

        </div>
    )
}

