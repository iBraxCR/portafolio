# Portafolio — Joschua Barahona

> Versión en español | [English version below](#portfolio--joschua-barahona-1)

Portafolio personal de Joschua Barahona, desarrollador fullstack basado en Costa Rica. Diseñado con criterio visual y construido para producción: interfaz editorial oscura, animaciones con intención y soporte completo de i18n (ES / EN).

## Stack

| Capa | Tecnología |
|---|---|
| Framework | [Astro 4](https://astro.build) |
| Estilos | CSS custom properties + [Tailwind CSS 4](https://tailwindcss.com) |
| Animación | [GSAP 3](https://gsap.com) + [Lenis](https://lenis.darkroom.engineering) |
| Tipografía | Fraunces (serif) · Geist (sans) · Geist Mono |
| Contenido | MDX (proyectos e insights) |
| i18n | Rutas `/{lang}/` con locale `es` por defecto |
| Build | Vite · Sharp (optimización de imágenes) |
| Deploy | [joschua.dev](https://joschua.dev) |

## Estructura

```
src/
├── components/       # Nav, Footer, BackToTop, LangSwitcher, etc.
├── content/
│   ├── projects/     # Casos de proyectos en ES y EN (MDX)
│   └── posts/        # Artículos / insights en ES y EN (MDX)
├── i18n/             # Traducciones JSON (es.json / en.json)
├── layouts/          # BaseLayout
├── pages/
│   └── [lang]/       # index, about, works, insights
├── styles/           # tokens.css, global.css
└── assets/           # Imágenes de proyectos
public/               # Archivos estáticos (CV, tech logos, fotos)
```

## Inicio rápido

Requiere [Node.js 18+](https://nodejs.org) y [pnpm](https://pnpm.io).

```bash
# Instalar dependencias
pnpm install

# Servidor de desarrollo (http://localhost:4321)
pnpm dev

# Build de producción
pnpm build

# Previsualizar build
pnpm preview
```

## Páginas

| Ruta | Descripción |
|---|---|
| `/{lang}/` | Home con hero, capabilities y proyectos destacados |
| `/{lang}/works/` | Listado completo de proyectos |
| `/{lang}/works/[slug]/` | Detalle de proyecto con galería |
| `/{lang}/about/` | Sobre mí, stack, principios y carrera |
| `/{lang}/insights/` | Artículos técnicos y de producto |

## Características

- Modo oscuro editorial por defecto con paleta de tokens CSS
- Scroll suavizado con Lenis + animaciones scroll-driven con GSAP ScrollTrigger
- i18n completo: ES / EN con rutas separadas y cambio de idioma en el nav
- Optimización de imágenes automática con Sharp
- Sitemap generado automáticamente
- Respeta `prefers-reduced-motion`

## Contacto

**Email:** joschuabarahona15@gmail.com
**Web:** [joschua.dev](https://joschua.dev)

---

# Portfolio — Joschua Barahona

> English version | [Versión en español arriba](#portafolio--joschua-barahona)

Personal portfolio of Joschua Barahona, fullstack developer based in Costa Rica. Designed with visual judgment and built for production: dark editorial UI, intentional animations and full i18n support (ES / EN).

## Stack

| Layer | Technology |
|---|---|
| Framework | [Astro 4](https://astro.build) |
| Styles | CSS custom properties + [Tailwind CSS 4](https://tailwindcss.com) |
| Animation | [GSAP 3](https://gsap.com) + [Lenis](https://lenis.darkroom.engineering) |
| Typography | Fraunces (serif) · Geist (sans) · Geist Mono |
| Content | MDX (projects and insights) |
| i18n | `/{lang}/` routes with `es` as default locale |
| Build | Vite · Sharp (image optimization) |
| Deploy | [joschua.dev](https://joschua.dev) |

## Structure

```
src/
├── components/       # Nav, Footer, BackToTop, LangSwitcher, etc.
├── content/
│   ├── projects/     # Project cases in ES and EN (MDX)
│   └── posts/        # Articles / insights in ES and EN (MDX)
├── i18n/             # JSON translations (es.json / en.json)
├── layouts/          # BaseLayout
├── pages/
│   └── [lang]/       # index, about, works, insights
├── styles/           # tokens.css, global.css
└── assets/           # Project images
public/               # Static files (CV, tech logos, photos)
```

## Quick start

Requires [Node.js 18+](https://nodejs.org) and [pnpm](https://pnpm.io).

```bash
# Install dependencies
pnpm install

# Development server (http://localhost:4321)
pnpm dev

# Production build
pnpm build

# Preview build
pnpm preview
```

## Pages

| Route | Description |
|---|---|
| `/{lang}/` | Home with hero, capabilities and featured projects |
| `/{lang}/works/` | Full project listing |
| `/{lang}/works/[slug]/` | Project detail with gallery |
| `/{lang}/about/` | About me, stack, principles and career |
| `/{lang}/insights/` | Technical and product articles |

## Features

- Dark editorial theme by default with CSS token palette
- Smooth scroll with Lenis + scroll-driven animations via GSAP ScrollTrigger
- Full i18n: ES / EN with separate routes and language switcher in nav
- Automatic image optimization with Sharp
- Auto-generated sitemap
- Respects `prefers-reduced-motion`

## Contact

**Email:** joschuabarahona15@gmail.com
**Web:** [joschua.dev](https://joschua.treecodes.net/es/)
