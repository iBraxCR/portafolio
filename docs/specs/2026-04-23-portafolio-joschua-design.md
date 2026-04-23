# Portafolio Joschua Barahona — Design Spec

**Autor:** Joschua Barahona
**Fecha:** 2026-04-23
**Estado:** Aprobado, listo para plan de implementación
**Inspirado en:** [raviklaassens.com](https://www.raviklaassens.com/) (solo referencia estética, no clon)

---

## Resumen ejecutivo

Portafolio personal bilingüe (ES/EN) para Joschua Barahona, desarrollador fullstack. Estética dark editorial con guiños de developer (tipografía mono para metadata, code snippets en proyectos). Construido con Astro para máxima performance estática, con islas de animación ricas (Lenis, GSAP, cursor custom, View Transitions). Incluye home, listado y detalle de proyectos, about, y blog (Insights).

Objetivos de performance no negociables: Lighthouse mobile ≥ 95, LCP < 1.5s, bundle JS inicial ≤ 30kb.

---

## 1. Arquitectura general

### Stack

- **Astro 4.x** — SSG con Content Collections, View Transitions, i18n nativo.
- **TypeScript** modo estricto.
- **Tailwind CSS v4** — utilidades + design tokens via CSS variables.
- **GSAP** + **ScrollTrigger** — animaciones complejas (islas).
- **Lenis** — smooth scroll global.
- **Motion One** — microinteracciones ligeras.
- **MDX** — contenido largo de proyectos y posts.
- **Deploy:** Vercel (edge cache, preview por PR).

### Rutas (bilingüe con prefijo)

```
/                       → redirect a /es/
/es/                    → home
/es/works/              → listado
/es/works/[slug]/       → detalle de proyecto
/es/about/
/es/insights/           → blog
/es/insights/[slug]/    → post
/es/insights/rss.xml    → RSS feed
/en/                    → espejo en inglés
```

El selector de idioma en el nav cambia `/es/` ↔ `/en/` preservando la ruta actual cuando existe la traducción; si no existe, cae a la home del otro idioma.

### Estructura del proyecto

```
src/
  content/
    config.ts              ← schemas Zod de collections
    projects/es/*.mdx
    projects/en/*.mdx
    posts/es/*.mdx
    posts/en/*.mdx
  i18n/
    es.json                ← UI strings
    en.json
  components/
    Nav.astro
    Footer.astro
    LangSwitcher.astro
    Cursor.astro
    SmoothScroll.astro
    ProjectCard.astro
    ProjectGrid.astro
    PostCard.astro
    Tag.astro
    Meta.astro
    Marquee.astro
    RevealOnScroll.astro
    ImageCompare.astro
  layouts/
    BaseLayout.astro
    ProjectLayout.astro
    PostLayout.astro
  pages/
    index.astro            ← redirect
    [lang]/
      index.astro
      works/
        index.astro
        [slug].astro
      about.astro
      insights/
        index.astro
        [slug].astro
        rss.xml.ts
  lib/
    i18n.ts                ← helper t(key, lang)
    animations.ts          ← helpers GSAP/Lenis
    utils.ts
  styles/
    tokens.css             ← CSS variables
    global.css
public/
  fonts/                   ← self-hosted (Fraunces, Geist Sans, Geist Mono)
  images/                  ← optimizadas vía Astro Image
docs/
  superpowers/specs/       ← este documento
  guides/                  ← cómo añadir proyecto, cómo publicar post
```

---

## 2. Sistema visual

### Paleta — dark editorial

```css
--bg:        #0A0A0A;       /* casi negro, no puro */
--bg-elev:   #141414;       /* cards, secciones alternadas */
--fg:        #EDEDED;       /* texto principal */
--fg-muted:  #8A8A8A;       /* metadata, fechas */
--fg-subtle: #4A4A4A;       /* dividers */
--accent:    #E8E3D8;       /* crema cálido editorial */
--line:      rgba(255,255,255,0.08);
```

### Tipografía

| Rol | Fuente | Uso |
|---|---|---|
| Display serif | **Fraunces** (Google Fonts, libre) | Hero, H1, H2 |
| Sans grotesca | **Geist Sans** | Body, descripciones |
| Mono | **Geist Mono** | Metadata, números, nav, stacks |

Self-hosted en `/public/fonts/`, `font-display: swap`, preload solo de la serif del hero.

### Escala tipográfica fluida

```css
--fs-display: clamp(3.5rem, 8vw, 9rem);
--fs-h1:      clamp(2.25rem, 5vw, 4.5rem);
--fs-h2:      clamp(1.75rem, 3.5vw, 3rem);
--fs-body:    1rem;
--fs-small:   0.8125rem;
```

### Layout

- Grid 12 columnas, gutter 24px, max-width 1440px.
- Padding lateral: 24px mobile / 48px tablet / 80px desktop.
- Ritmo vertical: múltiplos de 8px.

### Reglas de estilo

- **0px border-radius** en todo. Estética cuadrada editorial.
- Underlines con `text-decoration-thickness: 1px`, offset animado en hover.
- Imágenes sin sombras, sin bordes.

---

## 3. Anatomía de páginas

### Home `/[lang]/`

1. **Nav** sticky con `mix-blend-mode: difference`.
2. **Hero**: nombre `Joschua Barahona` en serif display + rol `Fullstack developer` + línea mono `~/ecuador` con typing effect.
3. **Selected Works**: 4–6 proyectos marcados `featured`. Fila editorial con número mono (01/02/03), título serif, año + categoría mono, hover dual-image.
4. **Insights teaser**: 3 posts recientes.
5. **CTA final**: "Construyamos algo" + email clicable (copia al portapapeles).
6. **Footer**: email, GitHub, LinkedIn, back-to-top.

### Works `/[lang]/works/`

Lista índice editorial completa. Fila por proyecto:

```
01 — 2025 — nombre del proyecto          [fullstack, api]
```

Hover revela imagen a la derecha. Mobile: imagen pequeña siempre visible.

### Works detalle `/[lang]/works/[slug]/`

```
Meta mono · 01 / 2025 / Cliente / 3 min read
Título serif
Descripción corta

[Hero image full-bleed, parallax]

Context (MDX):
  - Problema
  - Proceso
  - Stack (dos columnas mono: FRONTEND / BACKEND)
  - Resultados (Lighthouse, métricas)

Galería (grid 2 cols con tamaños alternados)

Code snippets opcionales (MDX)

→ Siguiente proyecto (morph transition)
```

### About `/[lang]/about/`

- Foto con reveal por clip-path.
- Bio en 2 columnas (párrafo + lista de skills).
- Skills agrupadas: `Frontend`, `Backend`, `DevOps / Infra`, `Tooling`.
- CV descargable (PDF).
- Contacto.

### Insights `/[lang]/insights/` y detalle

- Lista: título + fecha mono + tiempo de lectura. Filtros por categoría (`frontend`, `backend`, `devops`, `process`).
- Post: max-width ~680px, hero image, MDX con callouts y code blocks.
- RSS por idioma.

---

## 4. Sistema de animaciones

### Librerías y carga

| Librería | Uso | Estrategia |
|---|---|---|
| Lenis | Smooth scroll | Island en root, `client:idle` |
| GSAP + ScrollTrigger | Reveals, parallax | Island donde se usa, `client:visible` |
| Motion One | Hovers ligeros | Importado en componentes específicos |
| View Transitions API | Transiciones entre páginas | Nativo Astro |

### Inventario

**Globales**
- Smooth scroll Lenis (`lerp: 0.1`).
- Cursor custom 8px → 40px sobre links/cards, `mix-blend-mode`.
- View Transitions: fade + slide. Morph de card → hero en páginas de proyecto (FLIP con `view-transition-name`).

**Hero home**
- Letter-by-letter reveal del nombre (GSAP + CSS).
- Typing effect en línea mono.
- Parallax en scroll.

**Works list**
- Hover dual-image con fade + scale.
- Fade-in escalonado de números al hacer scroll.

**Proyecto detalle**
- Parallax 50% en hero image.
- Fade-up por imagen en galería (ScrollTrigger).
- Arrow que se alarga en hover del "→ Siguiente proyecto".

**About**
- Foto con clip-path reveal.
- Stagger fade-in en listas de skills.

**Nav**
- `mix-blend-mode: difference` automático.
- Underline animado con offset.

**CTA footer**
- Fade-in letra a letra del "Construyamos algo".
- Copiar email → toast mono.

### Accesibilidad del movimiento

- `prefers-reduced-motion: reduce` desactiva Lenis, GSAP reveals, y reduce transiciones a `duration: 0`. Obligatorio.
- Cursor custom con fallback al cursor nativo.
- Sitio navegable sin JS (degradación a estático).

---

## 5. Modelo de contenido

### Collection `projects`

```ts
const projects = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    slug: z.string(),                 // pareo entre idiomas
    lang: z.enum(['es', 'en']),
    number: z.number(),
    year: z.number(),
    client: z.string().optional(),
    role: z.array(z.string()),
    category: z.enum(['web-app', 'landing', 'brand-web', 'api', 'tool']),
    stack: z.object({
      frontend: z.array(z.string()).optional(),
      backend: z.array(z.string()).optional(),
      infra: z.array(z.string()).optional(),
    }),
    cover: image(),
    coverHover: image().optional(),
    gallery: z.array(image()).optional(),
    url: z.string().url().optional(),
    repo: z.string().url().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    description: z.string().max(160),
    publishedAt: z.date(),
  }),
});
```

### Collection `posts`

```ts
const posts = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    slug: z.string(),
    lang: z.enum(['es', 'en']),
    excerpt: z.string().max(200),
    cover: image().optional(),
    category: z.enum(['frontend', 'backend', 'devops', 'process']),
    tags: z.array(z.string()),
    readingTime: z.number(),
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
    draft: z.boolean().default(false),
  }),
});
```

### UI strings (JSON)

`src/i18n/es.json` y `src/i18n/en.json`. Helper `t(key, lang)` con fallback a `en`.

Ejemplo:
```json
{
  "nav": { "works": "Trabajos", "about": "Sobre mí", "insights": "Ideas" },
  "hero": { "role": "Fullstack developer", "location": "basado en ecuador" },
  "works": { "allProjects": "Todos los proyectos", "nextProject": "Siguiente proyecto" },
  "cta": { "title": "Construyamos algo", "email": "Copiar email" },
  "meta": { "minRead": "min de lectura", "year": "Año", "role": "Rol", "client": "Cliente" }
}
```

---

## 6. Performance, SEO y accesibilidad

### Objetivos medibles (Lighthouse mobile)

- Performance ≥ 95
- LCP < 1.5s
- CLS < 0.05
- INP < 200ms
- Bundle JS inicial ≤ 30kb

### Técnicas

- `<Image>` de Astro → WebP/AVIF automático, lazy, con `width/height`.
- Fuentes self-hosted, `font-display: swap`, preload selectivo.
- Astro envía 0kb JS por defecto; GSAP/Lenis/Motion solo como islands.
- Tailwind v4 purga automático. CSS crítico inline.
- View Transitions API nativa.
- `prefetch: "hover"` en links internos.
- Vercel edge cache.

### SEO

- Metadata por página, Open Graph completo.
- `hreflang` entre `/es/` y `/en/`.
- Canonical URL por página.
- Sitemap automático con `@astrojs/sitemap`.
- `robots.txt`.
- RSS feed por idioma.
- JSON-LD: `Person` en home/about, `Article` en posts, `CreativeWork` en proyectos.
- OG images dinámicas con Satori.

### Accesibilidad (WCAG 2.2 AA)

- Contrastes verificados (texto principal 14.3:1, muted 5.1:1).
- Focus visible con outline `--accent` 2px, offset 4px.
- Navegación por teclado completa. Skip link al contenido.
- HTML semántico. Un solo `<h1>` por página.
- `alt` obligatorio en imágenes (validado por Zod).
- `prefers-reduced-motion` respetado.
- Color no como única señal de estado.

### Monitoreo

- Vercel Analytics (Web Vitals reales).
- Lighthouse CI en GitHub Actions: PR falla si Performance < 90.

---

## 7. Flujo de trabajo, deploy y entregables

### Git

- Repo GitHub.
- `main` → producción.
- `dev` → staging (opcional).
- Features en `feat/*`, fixes en `fix/*`.

### Entornos

| Entorno | URL | Rama |
|---|---|---|
| Local | `localhost:4321` | cualquiera |
| Preview | `joschua-[branch].vercel.app` | cada PR |
| Staging | `staging.joschua.dev` (opcional) | `dev` |
| Producción | dominio a definir | `main` |

### Scripts

```json
{
  "dev":     "astro dev",
  "build":   "astro build",
  "preview": "astro preview",
  "check":   "astro check && tsc --noEmit",
  "lint":    "eslint . && prettier --check .",
  "format":  "prettier --write ."
}
```

### Tooling

- ESLint + Prettier estrictos.
- Husky + lint-staged en pre-commit: lint, format, `astro check`.
- TypeScript strict desde el inicio.

### Deploy

- Vercel conectado al repo. Push a `main` → producción. PR → preview.
- Dominio a elegir (`joschua.dev`, `barahona.dev`, etc.).

### Fases de implementación (preview)

1. Setup (Astro, Tailwind, TS, i18n, collections, tokens, fuentes).
2. Layout base (Nav, Footer, BaseLayout, cursor, smooth scroll).
3. Home (hero, works, posts teaser, CTA).
4. Works (listado + detalle + view transitions).
5. About.
6. Insights (listado + detalle + RSS + OG images).
7. Animaciones finas (reveals, parallax, typing, morph).
8. Audit performance + a11y.
9. Deploy + dominio.
10. Pulido final (contenido real, microcopy bilingüe).

### Entregables

- Repo GitHub con README.
- Sitio desplegado.
- Lighthouse score documentado.
- Guías en `/docs/guides/`: cómo añadir proyecto, cómo publicar post, cómo editar UI strings.

---

## Fuera de alcance (explícito)

- CMS headless (Sanity, Contentful).
- Formulario de contacto con backend (email clicable es suficiente por ahora).
- Autenticación / zona privada.
- Dashboard analytics custom.
- Escena WebGL / Three.js en hero.
- Tests automatizados de UI (Playwright/Cypress).

Cualquiera puede añadirse después como fase adicional.

---

## Decisiones clave y razones

| Decisión | Razón |
|---|---|
| Astro sobre Next.js | Portfolio estático no necesita runtime React. 0kb JS por defecto. |
| MDX sobre JSON para contenido | Permite componentes, code blocks, imágenes colocadas. |
| JSON para UI strings | Lo correcto para frases cortas repetidas. |
| Carpetas por idioma | Navegación clara en el repo, simple para el build. |
| Dark editorial (no "Ravi invertido") | Diferencia del referente, encaja con identidad dev. |
| Geist Mono en metadata | Comunica identidad dev sin perder elegancia editorial. |
| GSAP como island | Experiencia rica sin penalizar el bundle inicial. |
| Lighthouse CI bloqueante | Evita degradación silenciosa de performance. |
