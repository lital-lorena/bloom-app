# Design system — Bloom

> Obligatorio para todo el Frontend. Antes de generar cualquier componente React, pantalla, layout o estilo Tailwind, lee esta guía completa. Es la referencia visual oficial de Bloom.

---

## Visión visual de Bloom

Bloom debe transmitir **crecimiento, calidez y confianza**: un espacio donde la reinvención profesional se siente posible y acompañada, no competitiva ni fría.

La interfaz será:

- **Clara y legible:** prioridad al contenido (posts, historias, recursos) sin ruido visual.
- **Cálida y humana:** formas suaves, espacios generosos y tono visual cercano, no corporativo rígido.
- **Femenina sin estereotipos:** evitar clichés infantilizantes; apuntar a madurez, autonomía y comunidad.
- **Moderna y accesible:** contraste suficiente, tipografía legible y componentes consistentes en móvil y escritorio.

> Metáfora visual: **florecer** — de la semilla al brote, con ritmo pausado y celebración de pequeños avances.

---

## Público objetivo

Mujeres en transición o reinvención profesional, con perfiles diversos:

- Cambio de sector o de empleo a emprendimiento.
- Retorno al mercado laboral tras una pausa.
- Búsqueda de red, referentes y recursos prácticos.
- Sin límite de edad ni de industria de origen.

Implicaciones de diseño:

- Lenguaje visual inclusivo y respetuoso.
- Formularios y textos claros (registro, perfil, filtros).
- Sensación de comunidad segura, no de red social masiva ni performativa.

---

## Identidad de marca

**Bloom NO debe parecer:**

- LinkedIn corporativo
- Una plataforma fría de SaaS
- Una app de coaching espiritual
- Una cuenta de frases motivacionales

**Bloom debe sentirse como:**

> "Una comunidad profesional cálida donde mujeres comparten experiencias, recursos y oportunidades para reinventarse profesionalmente."

---

## Valores de marca


| Valor        | En la interfaz                                                                           |
| ------------ | ---------------------------------------------------------------------------------------- |
| Comunidad    | El feed y los perfiles destacan voces reales; el diseño favorece lectura y conversación. |
| Apoyo        | Likes y comentarios visibles pero discretos; feedback positivo sin presión por métricas. |
| Utilidad     | Recursos votados y enlaces con jerarquía clara; lo importante se encuentra rápido.       |
| Contexto     | País, ciudad y temática visibles en filtros y perfiles; cercanía geográfica y temática.  |
| Autenticidad | Espacio para "mi historia"; tono visual honesto, sin filtros excesivos de "perfección".  |


---

## Paleta de colores

### Colores principales


| Nombre             | Token                 | Hex       | Uso                                |
| ------------------ | --------------------- | --------- | ---------------------------------- |
| Bloom purple       | `brand-primary`       | `#8C52FF` | Botones CTA, links activos, badges |
| Bloom purple dark  | `brand-primary-hover` | `#7440E8` | Hover y estados activos            |
| Bloom purple light | `brand-primary-light` | `#F3EEFF` | Fondos suaves, hover secundario    |
| Bloom warm         | `brand-warm`          | `#C4704F` | Acentos, iconos destacados, likes  |
| Bloom rose         | `brand-rose`          | `#D4A5A5` | Tags, chips, detalles decorativos  |


### Neutros


| Nombre           | Token            | Hex       | Uso                                  |
| ---------------- | ---------------- | --------- | ------------------------------------ |
| Background       | `bg-primary`     | `#FDFAF6` | Fondo principal de toda la app       |
| Background suave | `bg-secondary`   | `#FFF8E1` | Fondos de secciones, sidebars        |
| Texto principal  | `text-primary`   | `#3D2B1F` | Títulos, párrafos, labels            |
| Texto suave      | `text-muted`     | `#9CA3AF` | Placeholders, texto secundario       |
| Surface card     | `surface-card`   | `#FFFFFF` | Fondo de todas las cards             |
| Border           | `border-default` | `#E5E7EB` | Bordes de cards, inputs, separadores |


### Semánticos


| Nombre  | Hex       | Uso                            |
| ------- | --------- | ------------------------------ |
| Success | `#4A9B6E` | Confirmaciones, estados OK     |
| Warning | `#D4A03C` | Avisos                         |
| Error   | `#C45C5C` | Errores de formulario, alertas |


### Reglas de uso del color

- Fondo general claro (`#FDFAF6`) para reducir fatiga en lectura prolongada del feed.
- Color primario (`#8C52FF`) reservado para acciones principales (registrarse, publicar, CTA).
- Mantener ratio de contraste WCAG AA mínimo en texto sobre fondos.
- No depender solo del color para estados — añadir siempre icono o texto de apoyo.

---

## Tipografía

### Familias

- **Titulares:** `Fraunces` (Google Fonts) — personalidad suave y editorial
- **Cuerpo y UI:** `Inter` o `DM Sans` (Google Fonts) — alta legibilidad en pantalla

### Escala de tamaños


| Elemento | Tamaño | Peso         | Uso                                   |
| -------- | ------ | ------------ | ------------------------------------- |
| H1       | 32px   | 700 bold     | Título de página principal            |
| H2       | 24px   | 600 semibold | Títulos de sección                    |
| H3       | 20px   | 600 semibold | Subtítulos, nombres en cards          |
| Body     | 16px   | 400 regular  | Texto de posts, descripciones         |
| Small    | 14px   | 400 regular  | Fechas, metadatos, labels secundarios |
| Tiny     | 12px   | 400 regular  | Badges, contadores, tooltips          |
| Botón    | 16px   | 600 semibold | Texto de botones                      |


- Interlineado cuerpo: 1.5–1.6
- Longitud de línea en posts: máx. ~65–75 caracteres en escritorio

---

## Espaciado

Sistema basado en múltiplos de 4px (escala Tailwind):


| Nombre | Valor | Tailwind |
| ------ | ----- | -------- |
| XS     | 4px   | `p-1`    |
| S      | 8px   | `p-2`    |
| M      | 16px  | `p-4`    |
| L      | 24px  | `p-6`    |
| XL     | 32px  | `p-8`    |
| XXL    | 48px  | `p-12`   |


- Nunca menos de 16px de padding dentro de una card o sección.
- Contenedor máximo del feed en escritorio: ~720–800px.
- Márgenes laterales mínimos en móvil: 16px.

---

## Componentes clave

### Card de post (feed)

```
- Fondo: #FFFFFF
- Borde: 1px solid #E5E7EB  (o sombra ligera: 0 1px 4px rgba(0,0,0,0.06))
- Border-radius: 12px
- Padding: 20px
- Avatar: circular, 40px, arriba izquierda
- Nombre + fecha al lado del avatar
- Texto del post debajo
- Barra de acciones abajo: like, comentar, compartir

```

### Botón primario (CTA)

```
- Fondo: #8C52FF
- Texto: blanco, 16px, semibold
- Border-radius: 8px
- Padding: 10px 20px
- Hover: #7440E8
- Sin bordes, sin sombra agresiva

```

### Botón secundario

```
- Fondo: transparente
- Borde: 1px solid #8C52FF
- Texto: #8C52FF, 16px, semibold
- Border-radius: 8px
- Hover: fondo #F3EEFF

```

### Input / campo de formulario

```
- Fondo: #FFFFFF
- Borde: 1px solid #E5E7EB
- Border-radius: 8px
- Padding: 12px 16px
- Texto: #3D2B1F, 16px
- Placeholder: #9CA3AF
- Focus: borde #8C52FF
- Label encima del input, 14px, #3D2B1F
- Error: texto rojo #C45C5C debajo del campo

```

### Navbar

```
- Fondo: #FFFFFF
- Borde inferior: 1px solid #E5E7EB
- Logo a la izquierda
- Links de navegación al centro o derecha
- Avatar/perfil a la derecha si está logueada
- Sticky (se queda fija al hacer scroll)

```

### Avatar

```
- Circular siempre
- Feed: 40px
- Perfil: 96px
- Fallback: inicial del nombre sobre fondo #F3EEFF

```

---

## Iconografía

- Iconos lineales, trazo simple, mismo peso visual.
- Librería recomendada: Lucide o Heroicons.
- Fotos de perfil y posts: bordes redondeados moderados, sin filtros agresivos.

---

## Tono de microcopy (textos de la UI)

- Cercano y directo en español.
- Mensajes de error claros y sin culpar a la usuaria.
- CTAs orientados a acción: «Publicar», «Unirme a Bloom», «Ver mi perfil».

---

## Accesibilidad

- No depender solo del color para estados (añadir icono o texto).
- Áreas táctiles mínimas 44×44px en móvil.
- Focus visible en navegación por teclado.
- Contraste mínimo WCAG AA en todo texto.

---

## Referencias de experiencia

- Pinterest — exploración visual, feed fluido
- Medium — lectura cómoda, tipografía limpia
- Substack — comunidad + contenido de valor

---

## Qué evitar

- Paletas neón o contrastes agresivos tipo "startup genérica".
- Densidad excesiva de información en el feed.
- Patrones que presionen engagement (contadores enormes, notificaciones invasivas).
- Gradientes excesivos o sombras agresivas.
- Estética corporativa azul tradicional.

---

## Regla principal

> Cuando existan varias opciones de diseño, elegir siempre la que transmita:
>
> ✅ Profesional + Humano + Inspirador
>
> antes que:
>
> ❌ Corporativo + Frío + Tecnológico

---

## Próximos pasos

- Añadir referencias visuales en las carpetas hermanas (moodboard/, login/, feed/, etc.).
- Validar paleta y contrastes en ../colors/.
- Traducir tokens a variables Tailwind al iniciar el Sprint 3.

