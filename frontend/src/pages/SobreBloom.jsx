import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import BloomLogo from '../components/BloomLogo'
import BloomButton from '../components/BloomButton'
import UserMenu from '../components/UserMenu'
import BackLink from '../components/BackLink'
import heroImage from '../assets/hero.png'

const valores = [
  {
    title: 'Comunidad sobre competencia',
    desc: 'Bloom no es una red social de postureo. Es un espacio donde se celebra el progreso de cada una, sin comparaciones.',
  },
  {
    title: 'Autenticidad',
    desc: 'Espacio seguro para compartir dudas, miedos y logros tal y como son, sin filtros de perfección profesional.',
  },
  {
    title: 'Crecimiento con calma',
    desc: 'Como una flor, la reinvención tiene su propio ritmo. No hay prisa, hay proceso.',
  },
  {
    title: 'Diversidad de caminos',
    desc: 'No hay un único camino válido hacia la reinvención. Cada historia, edad y sector de origen suma valor a la comunidad.',
  },
  {
    title: 'Habilidades que viajan contigo',
    desc: 'Lo aprendido en una etapa profesional nunca se pierde, se transforma y aporta en la siguiente.',
  },
]

const bloomMeshStyle = {
  backgroundColor: '#FFA58B',
  backgroundImage: `
    radial-gradient(ellipse 130% 110% at -5% -10%, #FF5FA8 0%, rgba(255, 95, 168, 0.72) 38%, transparent 72%),
    radial-gradient(ellipse 110% 95% at 105% 45%, #FFC2A8 0%, rgba(255, 194, 168, 0.88) 42%, transparent 70%),
    radial-gradient(ellipse 90% 80% at 35% 55%, #FF7E8A 0%, rgba(255, 126, 138, 0.45) 48%, transparent 75%),
    radial-gradient(ellipse 75% 65% at 65% 15%, rgba(255, 165, 139, 0.75) 0%, transparent 58%),
    radial-gradient(ellipse 85% 70% at 50% 100%, rgba(255, 194, 168, 0.55) 0%, transparent 62%)
  `,
}

export default function SobreBloom() {
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

      {/* Hero */}
      <section className="relative w-full pt-24">
        <div className="relative min-h-[18rem] w-full overflow-hidden md:min-h-[22rem]">
          <img
            src={heroImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
            aria-hidden="true"
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
          <div className="relative z-10 flex min-h-[18rem] flex-col justify-end px-6 pb-10 pt-8 md:min-h-[22rem] md:px-12 md:pb-14">
            <BackLink to="/" label="Volver al inicio" variant="hero" />
            <h1 className="font-title text-4xl tracking-tight text-white sm:text-5xl md:text-6xl">
              Por qué nació Bloom
            </h1>
            <p className="font-subtitle mt-3 max-w-2xl text-base text-white/95 md:text-lg">
              Un espacio para que ninguna mujer reinvente su carrera en soledad.
            </p>
          </div>
        </div>
      </section>

      {/* Origen */}
      <section className="px-6 py-16 md:px-12 md:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-base leading-relaxed text-bloom-dark md:text-lg">
            Bloom nació de una idea sencilla: la reinvención profesional no debería vivirse en soledad.
            Cambiar de carrera, volver al mercado laboral tras una pausa, o atreverse a empezar de cero en
            otro sector son procesos llenos de dudas, miedo al síndrome del impostor y la sensación de no
            saber por dónde empezar. Bloom es el espacio que a muchas mujeres les hubiera gustado tener en
            ese momento.
          </p>
        </div>
      </section>

      {/* Misión */}
      <section
        className="px-6 py-16 md:px-12 md:py-20"
        style={{
          background: 'linear-gradient(to bottom, #FFFFFF 0%, #FFF5F2 45%, #FFD4CC 100%)',
        }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-title mb-6 text-3xl text-bloom-dark md:text-4xl">
            Nuestra misión
          </h2>
          <p className="font-subtitle text-lg leading-relaxed text-bloom-dark md:text-xl">
            Crear una comunidad digital donde las mujeres en transición profesional puedan compartir sus
            historias, encontrarse en las de otras, y descubrir que las habilidades que ya tienen — aunque
            vengan de un camino distinto — tienen un lugar en su nueva etapa.
          </p>
        </div>
      </section>

      {/* Valores */}
      <section className="bg-white px-6 py-16 md:px-12 md:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-title mb-4 text-center text-3xl text-bloom-dark">
            Nuestros valores
          </h2>
          <p className="mb-12 text-center text-bloom-gray">
            Los principios que guían cada conversación, cada historia y cada paso en la comunidad.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {valores.map((valor, i) => (
              <div
                key={i}
                className={`rounded-2xl border-2 border-bloom-pink bg-transparent p-8 ${i === valores.length - 1 ? 'md:col-span-2 md:mx-auto md:max-w-xl' : ''}`}
              >
                <h3 className="font-subtitle mb-3 text-xl text-bloom-dark">{valor.title}</h3>
                <p className="leading-relaxed text-bloom-gray">{valor.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-16 md:px-12 md:pb-20">
        <div
          className="relative overflow-hidden rounded-[2.5rem] px-8 py-16 text-center md:rounded-[3.5rem] md:px-16 md:py-20"
          style={bloomMeshStyle}
        >
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 1200 400"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <g style={{ filter: 'blur(0.5px)' }}>
              <path d="M-80 90 C180 30, 380 150, 620 80 S1020 20, 1280 110" stroke="white" strokeWidth="52" fill="none" opacity="0.13" strokeLinecap="round" />
              <path d="M-60 260 C220 190, 420 310, 680 230 S1060 170, 1300 280" stroke="white" strokeWidth="40" fill="none" opacity="0.11" strokeLinecap="round" />
            </g>
          </svg>
          <div className="relative z-10 mx-auto max-w-xl">
            <h2 className="font-title mb-4 text-3xl text-white md:text-4xl">
              ¿Te reconoces en esta historia?
            </h2>
            <p className="mb-8 text-base font-light leading-relaxed text-white/95">
              Únete a una comunidad que entiende tu camino y te acompaña en cada paso.
            </p>
            {token ? (
              <BloomButton variant="hero" className="mx-auto" onClick={() => navigate('/feed')}>
                Ir al Feed
              </BloomButton>
            ) : (
              <BloomButton variant="hero" showDot className="mx-auto" onClick={() => navigate('/register')}>
                Empieza ahora
              </BloomButton>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-black/5 px-6 py-8 text-center md:px-12">
        <BloomLogo className="mx-auto mb-3 h-14 w-auto" />
        <p className="text-sm text-bloom-gray">© 2025 Bloom. Hecho con amor para mujeres que florecen.</p>
      </footer>
    </div>
  )
}
