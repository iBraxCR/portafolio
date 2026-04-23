# Fundación del Portafolio — Plan de Implementación

> **Para desarrolladores (humanos o agentes):** Cada tarea tiene pasos con checkbox (`- [ ]`) para seguimiento. Ejecutar en orden, commiteando al final de cada tarea.

**Objetivo:** Dejar el portafolio corriendo en `localhost:4321` con routing bilingüe, design tokens, layout base (nav + footer), y una home funcional con estructura real — sin animaciones avanzadas todavía.

**Arquitectura:** Astro 4 con TypeScript estricto, Tailwind v4 con tokens por CSS variables, i18n con prefijo de ruta (`/es/`, `/en/`), Content Collections con Zod, MDX para contenido, fuentes self-hosted.

**Tech Stack:** Astro 4, TypeScript, Tailwind CSS v4, MDX, Zod, pnpm.

**Fuera de alcance de este plan:** páginas de detalle de proyecto, about completo, blog, animaciones GSAP/Lenis, cursor custom, view transitions avanzadas, deploy. Todo eso va en planes posteriores.

---

## Mapa de archivos creados en este plan

```
portafolio/
  .gitignore                        ← ya existe
  package.json                      ← crear
  pnpm-lock.yaml                    ← generado
  tsconfig.json                     ← crear
  astro.config.mjs                  ← crear
  tailwind.config.ts                ← crear (para v4)
  src/
    content/
      config.ts                     ← schemas Zod
      projects/es/.gitkeep
      projects/en/.gitkeep
      posts/es/.gitkeep
      posts/en/.gitkeep
    i18n/
      es.json
      en.json
    lib/
      i18n.ts                       ← helper t(key, lang)
      utils.ts
    styles/
      tokens.css                    ← CSS variables
      global.css                    ← reset + base
    components/
      Nav.astro
      Footer.astro
      LangSwitcher.astro
      Meta.astro
    layouts/
      BaseLayout.astro
    pages/
      index.astro                   ← redirect a /es/
      [lang]/
        index.astro                 ← home
        works/index.astro           ← placeholder
        about.astro                 ← placeholder
        insights/index.astro        ← placeholder
  public/
    fonts/
      fraunces/…                    ← .woff2
      geist-sans/…
      geist-mono/…
    favicon.svg
```

---

## Tarea 1: Scaffold del proyecto Astro + pnpm

**Archivos:**
- Crear: `package.json`, `tsconfig.json`, `astro.config.mjs`, `src/env.d.ts`, `src/pages/index.astro` (temporal)

- [ ] **Paso 1.1: Crear `package.json`**

```json
{
  "name": "portafolio",
  "type": "module",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check && tsc --noEmit",
    "astro": "astro"
  },
  "dependencies": {
    "astro": "^4.16.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.0",
    "typescript": "^5.6.0"
  }
}
```

- [ ] **Paso 1.2: Crear `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "preserve",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Paso 1.3: Crear `astro.config.mjs` mínimo**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://joschua.dev',
});
```
(Se expandirá en la Tarea 2 con integraciones e i18n.)

- [ ] **Paso 1.4: Crear `src/env.d.ts`**

```ts
/// <reference path="../.astro/types.d.ts" />
```

- [ ] **Paso 1.5: Crear placeholder `src/pages/index.astro`**

```astro
---
---
<html lang="es">
  <head><meta charset="utf-8" /><title>Portafolio</title></head>
  <body>Setup en progreso.</body>
</html>
```
(Se reemplaza en Tarea 12 por la lógica de redirect.)

- [ ] **Paso 1.6: Instalar dependencias**

```bash
pnpm install
```

- [ ] **Paso 1.7: Verificar que arranca**

```bash
pnpm dev
```
Esperado: servidor arranca en `http://localhost:4321`, muestra "Setup en progreso." `Ctrl+C`.

- [ ] **Paso 1.8: Commit**

```bash
git add package.json pnpm-lock.yaml tsconfig.json astro.config.mjs src/
git commit -m "chore: scaffold inicial de Astro"
```

---

## Tarea 2: Integraciones (Tailwind v4, MDX, Sitemap)

**Archivos:**
- Modificar: `package.json`, `astro.config.mjs`
- Crear: `src/styles/global.css` (vacío por ahora)

- [ ] **Paso 2.1: Instalar integraciones**

```bash
pnpm add -D @astrojs/mdx @astrojs/sitemap
pnpm add tailwindcss@next @tailwindcss/vite@next
```

- [ ] **Paso 2.2: Configurar `astro.config.mjs`**

Reemplazar el archivo con:
```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://joschua.dev', // cambiar cuando exista dominio final
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: true },
  },
  redirects: {
    '/': '/es/',
  },
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Paso 2.3: Crear `src/styles/global.css` con import de Tailwind v4**

```css
@import "tailwindcss";
```

- [ ] **Paso 2.4: Verificar que sigue arrancando**

```bash
pnpm dev
```
Esperado: servidor arranca sin errores. `Ctrl+C`.

- [ ] **Paso 2.5: Commit**

```bash
git add package.json pnpm-lock.yaml astro.config.mjs src/styles/global.css
git commit -m "chore: integrar tailwind v4, mdx, sitemap, i18n nativo"
```

---

## Tarea 3: Self-host de fuentes (Fraunces, Geist Sans, Geist Mono)

**Archivos:**
- Crear: `public/fonts/fraunces/Fraunces-Variable.woff2`
- Crear: `public/fonts/geist-sans/Geist-Variable.woff2`
- Crear: `public/fonts/geist-mono/GeistMono-Variable.woff2`
- Crear: `src/styles/fonts.css`

- [ ] **Paso 3.1: Descargar Fraunces**

Desde Google Fonts (https://fonts.google.com/specimen/Fraunces) o https://github.com/undercasetype/Fraunces descargar la fuente variable en formato `.woff2` y colocarla en `public/fonts/fraunces/Fraunces-Variable.woff2`.

- [ ] **Paso 3.2: Descargar Geist Sans y Geist Mono**

Desde https://vercel.com/font o https://github.com/vercel/geist-font descargar:
- `Geist-Variable.woff2` → `public/fonts/geist-sans/Geist-Variable.woff2`
- `GeistMono-Variable.woff2` → `public/fonts/geist-mono/GeistMono-Variable.woff2`

- [ ] **Paso 3.3: Crear `src/styles/fonts.css`**

```css
@font-face {
  font-family: 'Fraunces';
  src: url('/fonts/fraunces/Fraunces-Variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Geist Sans';
  src: url('/fonts/geist-sans/Geist-Variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Geist Mono';
  src: url('/fonts/geist-mono/GeistMono-Variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
```

- [ ] **Paso 3.4: Importar en `global.css`**

Editar `src/styles/global.css`:
```css
@import "tailwindcss";
@import "./fonts.css";
```

- [ ] **Paso 3.5: Commit**

```bash
git add public/fonts/ src/styles/fonts.css src/styles/global.css
git commit -m "feat(styles): self-host de fraunces, geist sans y geist mono"
```

---

## Tarea 4: Design tokens (CSS variables + theme de Tailwind)

**Archivos:**
- Crear: `src/styles/tokens.css`
- Modificar: `src/styles/global.css`

- [ ] **Paso 4.1: Crear `src/styles/tokens.css`**

```css
:root {
  /* Color - dark editorial */
  --bg:        #0A0A0A;
  --bg-elev:   #141414;
  --fg:        #EDEDED;
  --fg-muted:  #8A8A8A;
  --fg-subtle: #4A4A4A;
  --accent:    #E8E3D8;
  --line:      rgba(255, 255, 255, 0.08);

  /* Tipografía - familias */
  --font-serif: 'Fraunces', Georgia, serif;
  --font-sans:  'Geist Sans', system-ui, -apple-system, sans-serif;
  --font-mono:  'Geist Mono', ui-monospace, 'Courier New', monospace;

  /* Tipografía - escala fluida */
  --fs-display: clamp(3.5rem, 8vw, 9rem);
  --fs-h1:      clamp(2.25rem, 5vw, 4.5rem);
  --fs-h2:      clamp(1.75rem, 3.5vw, 3rem);
  --fs-body:    1rem;
  --fs-small:   0.8125rem;

  /* Espaciado */
  --pad-x:      24px;
  --max-w:      1440px;

  /* Motion */
  --ease-out:   cubic-bezier(0.16, 1, 0.3, 1);
  --dur-fast:   160ms;
  --dur-base:   320ms;
  --dur-slow:   600ms;
}

@media (min-width: 768px) {
  :root { --pad-x: 48px; }
}

@media (min-width: 1280px) {
  :root { --pad-x: 80px; }
}
```

- [ ] **Paso 4.2: Configurar tema de Tailwind v4 dentro de `global.css`**

Tailwind v4 usa `@theme` directamente en CSS. Editar `src/styles/global.css`:

```css
@import "tailwindcss";
@import "./fonts.css";
@import "./tokens.css";

@theme {
  --color-bg: var(--bg);
  --color-bg-elev: var(--bg-elev);
  --color-fg: var(--fg);
  --color-fg-muted: var(--fg-muted);
  --color-fg-subtle: var(--fg-subtle);
  --color-accent: var(--accent);
  --color-line: var(--line);

  --font-serif: var(--font-serif);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
}

/* Reset + base */
html {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-sans);
  font-size: var(--fs-body);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

body {
  margin: 0;
  min-height: 100dvh;
}

a {
  color: inherit;
  text-decoration: none;
}

*, *::before, *::after {
  box-sizing: border-box;
}

/* Selección */
::selection {
  background: var(--accent);
  color: var(--bg);
}

/* Focus visible */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Paso 4.3: Verificar que compila**

```bash
pnpm dev
```
Abrir `localhost:4321`. La página por defecto de Astro debe verse con fondo oscuro casi negro y texto claro. `Ctrl+C`.

- [ ] **Paso 4.4: Commit**

```bash
git add src/styles/
git commit -m "feat(styles): tokens, tema dark editorial, tipografias"
```

---

## Tarea 5: i18n — JSON de strings y helper

**Archivos:**
- Crear: `src/i18n/es.json`, `src/i18n/en.json`
- Crear: `src/lib/i18n.ts`

- [ ] **Paso 5.1: Crear `src/i18n/es.json`**

```json
{
  "nav": {
    "works": "Trabajos",
    "about": "Sobre mí",
    "insights": "Ideas"
  },
  "hero": {
    "role": "Fullstack developer",
    "location": "basado en ecuador"
  },
  "works": {
    "selected": "Trabajos seleccionados",
    "all": "Todos los proyectos",
    "nextProject": "Siguiente proyecto"
  },
  "cta": {
    "title": "Construyamos algo",
    "email": "Copiar email"
  },
  "meta": {
    "minRead": "min de lectura",
    "year": "Año",
    "role": "Rol",
    "client": "Cliente",
    "stack": "Stack"
  },
  "footer": {
    "backToTop": "Volver arriba",
    "madeIn": "Hecho en Ecuador"
  },
  "common": {
    "readMore": "Leer más",
    "viewProject": "Ver proyecto",
    "viewCode": "Ver código"
  }
}
```

- [ ] **Paso 5.2: Crear `src/i18n/en.json`**

```json
{
  "nav": {
    "works": "Works",
    "about": "About",
    "insights": "Insights"
  },
  "hero": {
    "role": "Fullstack developer",
    "location": "based in ecuador"
  },
  "works": {
    "selected": "Selected works",
    "all": "All projects",
    "nextProject": "Next project"
  },
  "cta": {
    "title": "Let's build something",
    "email": "Copy email"
  },
  "meta": {
    "minRead": "min read",
    "year": "Year",
    "role": "Role",
    "client": "Client",
    "stack": "Stack"
  },
  "footer": {
    "backToTop": "Back to top",
    "madeIn": "Made in Ecuador"
  },
  "common": {
    "readMore": "Read more",
    "viewProject": "View project",
    "viewCode": "View code"
  }
}
```

- [ ] **Paso 5.3: Crear `src/lib/i18n.ts`**

```ts
import es from '../i18n/es.json';
import en from '../i18n/en.json';

export const locales = ['es', 'en'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'es';

const dictionaries = { es, en } as const;

/**
 * Resolve a dotted key against a locale's dictionary.
 * Falls back to English if the key is missing in the requested locale.
 * Returns the key itself as last-resort fallback to surface the bug visibly.
 */
export function t(key: string, lang: Locale = defaultLocale): string {
  const segments = key.split('.');
  const lookup = (dict: unknown): string | undefined => {
    let current: unknown = dict;
    for (const seg of segments) {
      if (current && typeof current === 'object' && seg in current) {
        current = (current as Record<string, unknown>)[seg];
      } else {
        return undefined;
      }
    }
    return typeof current === 'string' ? current : undefined;
  };

  return lookup(dictionaries[lang]) ?? lookup(dictionaries.en) ?? key;
}

/** Type guard to validate a locale string from a URL param. */
export function isLocale(value: string | undefined): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/** Build a href for the equivalent page in another locale. */
export function switchLocale(currentPath: string, to: Locale): string {
  // currentPath example: /es/works/mi-proyecto/
  const parts = currentPath.split('/').filter(Boolean);
  if (parts.length === 0) return `/${to}/`;
  parts[0] = to;
  return `/${parts.join('/')}/`;
}
```

- [ ] **Paso 5.4: Verificar TypeScript**

```bash
pnpm check
```
Esperado: sin errores.

- [ ] **Paso 5.5: Commit**

```bash
git add src/i18n/ src/lib/i18n.ts
git commit -m "feat(i18n): diccionarios es/en y helper t()"
```

---

## Tarea 6: Content Collections — schemas de projects y posts

**Archivos:**
- Crear: `src/content/config.ts`
- Crear: `src/content/projects/es/.gitkeep`, `src/content/projects/en/.gitkeep`
- Crear: `src/content/posts/es/.gitkeep`, `src/content/posts/en/.gitkeep`

- [ ] **Paso 6.1: Crear `src/content/config.ts`**

```ts
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      lang: z.enum(['es', 'en']),
      number: z.number().int().positive(),
      year: z.number().int(),
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

const posts = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      lang: z.enum(['es', 'en']),
      excerpt: z.string().max(200),
      cover: image().optional(),
      category: z.enum(['frontend', 'backend', 'devops', 'process']),
      tags: z.array(z.string()).default([]),
      readingTime: z.number().int().positive(),
      publishedAt: z.date(),
      updatedAt: z.date().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects, posts };
```

- [ ] **Paso 6.2: Crear directorios vacíos con `.gitkeep`**

```bash
mkdir -p src/content/projects/es src/content/projects/en src/content/posts/es src/content/posts/en
touch src/content/projects/es/.gitkeep src/content/projects/en/.gitkeep src/content/posts/es/.gitkeep src/content/posts/en/.gitkeep
```

- [ ] **Paso 6.3: Verificar**

```bash
pnpm check
```
Esperado: sin errores.

- [ ] **Paso 6.4: Commit**

```bash
git add src/content/
git commit -m "feat(content): schemas zod de projects y posts"
```

---

## Tarea 7: Componente `<Meta />` (helper visual para metadata mono)

**Archivos:**
- Crear: `src/components/Meta.astro`

- [ ] **Paso 7.1: Crear `src/components/Meta.astro`**

Componente reutilizable para mostrar líneas de metadata en tipografía mono (ej: `01 — 2025 — web-app`).

```astro
---
interface Props {
  items: (string | number)[];
  separator?: string;
  class?: string;
}

const { items, separator = '—', class: className = '' } = Astro.props;
const filtered = items.filter((v) => v !== undefined && v !== null && v !== '');
---

<span class={`meta ${className}`.trim()}>
  {filtered.map((item, i) => (
    <>
      {i > 0 && <span class="sep">{separator}</span>}
      <span>{item}</span>
    </>
  ))}
</span>

<style>
  .meta {
    font-family: var(--font-mono);
    font-size: var(--fs-small);
    color: var(--fg-muted);
    letter-spacing: 0.02em;
    text-transform: lowercase;
    display: inline-flex;
    gap: 0.5rem;
    align-items: baseline;
  }
  .sep {
    color: var(--fg-subtle);
  }
</style>
```

- [ ] **Paso 7.2: Commit**

```bash
git add src/components/Meta.astro
git commit -m "feat(components): Meta para metadata en mono"
```

---

## Tarea 8: Componente `<LangSwitcher />`

**Archivos:**
- Crear: `src/components/LangSwitcher.astro`

- [ ] **Paso 8.1: Crear `src/components/LangSwitcher.astro`**

```astro
---
import { locales, type Locale, switchLocale } from '../lib/i18n';

interface Props {
  current: Locale;
  path: string; // Astro.url.pathname
}

const { current, path } = Astro.props;
---

<div class="lang-switcher" role="group" aria-label="Language">
  {locales.map((loc) => {
    const href = switchLocale(path, loc);
    const isActive = loc === current;
    return (
      <a
        href={href}
        class:list={['lang', { active: isActive }]}
        aria-current={isActive ? 'true' : undefined}
        lang={loc}
      >
        {loc.toUpperCase()}
      </a>
    );
  })}
</div>

<style>
  .lang-switcher {
    display: inline-flex;
    gap: 0.75rem;
    font-family: var(--font-mono);
    font-size: var(--fs-small);
  }
  .lang {
    color: var(--fg-muted);
    transition: color var(--dur-fast) var(--ease-out);
  }
  .lang:hover {
    color: var(--fg);
  }
  .lang.active {
    color: var(--fg);
  }
</style>
```

- [ ] **Paso 8.2: Commit**

```bash
git add src/components/LangSwitcher.astro
git commit -m "feat(components): LangSwitcher es/en"
```

---

## Tarea 9: Componente `<Nav />`

**Archivos:**
- Crear: `src/components/Nav.astro`

- [ ] **Paso 9.1: Crear `src/components/Nav.astro`**

```astro
---
import { t, type Locale } from '../lib/i18n';
import LangSwitcher from './LangSwitcher.astro';

interface Props {
  lang: Locale;
  path: string;
}

const { lang, path } = Astro.props;
const base = `/${lang}`;

const links = [
  { href: `${base}/works/`, label: t('nav.works', lang) },
  { href: `${base}/about/`,  label: t('nav.about', lang) },
  { href: `${base}/insights/`, label: t('nav.insights', lang) },
];
---

<header class="nav">
  <a href={`${base}/`} class="brand">Joschua Barahona</a>

  <nav aria-label="Primary">
    <ul>
      {links.map((link) => (
        <li>
          <a href={link.href} aria-current={path.startsWith(link.href) ? 'page' : undefined}>
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </nav>

  <LangSwitcher current={lang} path={path} />
</header>

<style>
  .nav {
    position: sticky;
    top: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px var(--pad-x);
    gap: 2rem;
    mix-blend-mode: difference;
    color: var(--fg);
  }
  .brand {
    font-family: var(--font-serif);
    font-size: 1.125rem;
    letter-spacing: -0.01em;
  }
  nav ul {
    display: flex;
    gap: 2rem;
    list-style: none;
    margin: 0;
    padding: 0;
    font-family: var(--font-mono);
    font-size: var(--fs-small);
    text-transform: lowercase;
  }
  nav a {
    color: var(--fg-muted);
    transition: color var(--dur-fast) var(--ease-out);
  }
  nav a:hover,
  nav a[aria-current='page'] {
    color: var(--fg);
  }

  @media (max-width: 767px) {
    nav ul { gap: 1rem; }
  }
</style>
```

- [ ] **Paso 9.2: Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat(components): Nav sticky con blend-mode difference"
```

---

## Tarea 10: Componente `<Footer />`

**Archivos:**
- Crear: `src/components/Footer.astro`

- [ ] **Paso 10.1: Crear `src/components/Footer.astro`**

```astro
---
import { t, type Locale } from '../lib/i18n';

interface Props {
  lang: Locale;
}

const { lang } = Astro.props;
const year = new Date().getFullYear();
---

<footer class="footer">
  <div class="cta">
    <h2>{t('cta.title', lang)}</h2>
    <a href="mailto:hola@joschua.dev" class="email">hola@joschua.dev</a>
  </div>

  <div class="meta">
    <span>© {year} Joschua Barahona</span>
    <ul class="socials">
      <li><a href="https://github.com/joschua" target="_blank" rel="noopener">GitHub</a></li>
      <li><a href="https://linkedin.com/in/joschua" target="_blank" rel="noopener">LinkedIn</a></li>
    </ul>
    <span>{t('footer.madeIn', lang)}</span>
  </div>
</footer>

<style>
  .footer {
    padding: 8rem var(--pad-x) 3rem;
    border-top: 1px solid var(--line);
    margin-top: 8rem;
  }
  .cta {
    margin-bottom: 6rem;
  }
  .cta h2 {
    font-family: var(--font-serif);
    font-size: var(--fs-h1);
    font-weight: 400;
    line-height: 1;
    letter-spacing: -0.02em;
    margin: 0 0 1.5rem;
  }
  .email {
    font-family: var(--font-mono);
    font-size: var(--fs-small);
    color: var(--fg-muted);
    border-bottom: 1px solid currentColor;
    padding-bottom: 2px;
  }
  .email:hover { color: var(--fg); }

  .meta {
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    flex-wrap: wrap;
    font-family: var(--font-mono);
    font-size: var(--fs-small);
    color: var(--fg-muted);
    text-transform: lowercase;
  }
  .socials {
    display: flex;
    gap: 1.5rem;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .socials a:hover { color: var(--fg); }
</style>
```

- [ ] **Paso 10.2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat(components): Footer con CTA y metadata"
```

---

## Tarea 11: `BaseLayout` con `<head>`, Nav y Footer

**Archivos:**
- Crear: `src/layouts/BaseLayout.astro`

- [ ] **Paso 11.1: Crear `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import type { Locale } from '../lib/i18n';

interface Props {
  title: string;
  description: string;
  lang: Locale;
}

const { title, description, lang } = Astro.props;
const path = Astro.url.pathname;
const siteName = 'Joschua Barahona';
const fullTitle = title === siteName ? title : `${title} — ${siteName}`;
---

<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="generator" content={Astro.generator} />
    <title>{fullTitle}</title>
    <meta name="description" content={description} />

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preload" as="font" type="font/woff2" href="/fonts/fraunces/Fraunces-Variable.woff2" crossorigin />

    <link rel="canonical" href={new URL(path, Astro.site).toString()} />
    <link rel="alternate" hreflang="es" href={new URL(path.replace(/^\/en\//, '/es/'), Astro.site).toString()} />
    <link rel="alternate" hreflang="en" href={new URL(path.replace(/^\/es\//, '/en/'), Astro.site).toString()} />
    <link rel="alternate" hreflang="x-default" href={new URL('/es/', Astro.site).toString()} />

    <meta property="og:type" content="website" />
    <meta property="og:title" content={fullTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={new URL(path, Astro.site).toString()} />
    <meta property="og:locale" content={lang === 'es' ? 'es_ES' : 'en_US'} />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={fullTitle} />
    <meta name="twitter:description" content={description} />
  </head>
  <body>
    <a href="#main" class="skip-link">Skip to content</a>
    <Nav lang={lang} path={path} />
    <main id="main">
      <slot />
    </main>
    <Footer lang={lang} />

    <style is:global>
      .skip-link {
        position: absolute;
        top: -100px;
        left: 1rem;
        background: var(--bg);
        color: var(--fg);
        padding: 0.75rem 1rem;
        font-family: var(--font-mono);
        font-size: var(--fs-small);
        border: 1px solid var(--line);
        z-index: 100;
      }
      .skip-link:focus-visible {
        top: 1rem;
      }
    </style>
  </body>
</html>
```

- [ ] **Paso 11.2: Asegurar que existe `public/favicon.svg`**

Si no existe, crear uno mínimo:
```bash
cat > public/favicon.svg <<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#0A0A0A"/><text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle" font-family="Georgia, serif" font-size="20" fill="#EDEDED">J</text></svg>
SVG
```

- [ ] **Paso 11.3: Commit**

```bash
git add src/layouts/BaseLayout.astro public/favicon.svg
git commit -m "feat(layout): BaseLayout con meta, hreflang y skip link"
```

---

## Tarea 12: Eliminar placeholder `src/pages/index.astro`

El redirect `/` → `/es/` ya está en `astro.config.mjs` (Tarea 2). El archivo placeholder de la Tarea 1 debe borrarse para que el redirect funcione limpiamente.

**Archivos:**
- Eliminar: `src/pages/index.astro`

- [ ] **Paso 12.1: Eliminar el archivo**

```bash
rm src/pages/index.astro
```

- [ ] **Paso 12.2: Commit**

```bash
git add -A src/pages/index.astro
git commit -m "chore: eliminar placeholder de index; redirect vive en config"
```

---

## Tarea 13: Home page (`/[lang]/index.astro`)

**Archivos:**
- Crear: `src/pages/[lang]/index.astro`

- [ ] **Paso 13.1: Crear `src/pages/[lang]/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Meta from '../../components/Meta.astro';
import { t, locales, isLocale, type Locale } from '../../lib/i18n';

export function getStaticPaths() {
  return locales.map((lang) => ({ params: { lang } }));
}

const { lang: rawLang } = Astro.params;
if (!isLocale(rawLang)) {
  throw new Error(`Invalid locale: ${rawLang}`);
}
const lang: Locale = rawLang;

const title = 'Joschua Barahona';
const description =
  lang === 'es'
    ? 'Portafolio de Joschua Barahona — desarrollador fullstack.'
    : "Joschua Barahona's portfolio — fullstack developer.";
---

<BaseLayout title={title} description={description} lang={lang}>
  <section class="hero">
    <h1>Joschua Barahona</h1>
    <p class="role">{t('hero.role', lang)}</p>
    <Meta items={[t('hero.location', lang)]} class="location" />
  </section>

  <section class="works">
    <header class="section-head">
      <Meta items={['01']} />
      <h2>{t('works.selected', lang)}</h2>
    </header>
    <p class="placeholder">
      <!-- Proyectos destacados se listan aquí en el siguiente plan -->
      Coming soon.
    </p>
  </section>
</BaseLayout>

<style>
  .hero {
    padding: 8rem var(--pad-x) 6rem;
    max-width: var(--max-w);
    margin: 0 auto;
  }
  .hero h1 {
    font-family: var(--font-serif);
    font-size: var(--fs-display);
    font-weight: 400;
    line-height: 0.95;
    letter-spacing: -0.03em;
    margin: 0;
  }
  .hero .role {
    margin: 1.5rem 0 0;
    font-size: var(--fs-h2);
    font-family: var(--font-serif);
    font-weight: 300;
    font-style: italic;
    color: var(--fg-muted);
  }
  .hero .location {
    display: block;
    margin-top: 2rem;
  }

  .works {
    padding: 4rem var(--pad-x);
    max-width: var(--max-w);
    margin: 0 auto;
    border-top: 1px solid var(--line);
  }
  .section-head {
    display: flex;
    gap: 2rem;
    align-items: baseline;
    margin-bottom: 3rem;
  }
  .section-head h2 {
    font-family: var(--font-serif);
    font-size: var(--fs-h2);
    font-weight: 400;
    margin: 0;
  }
  .placeholder {
    color: var(--fg-muted);
    font-family: var(--font-mono);
    font-size: var(--fs-small);
  }
</style>
```

- [ ] **Paso 13.2: Verificar**

```bash
pnpm dev
```
Abrir `http://localhost:4321/` — debe redirigir a `/es/`. Ver hero con nombre grande en serif, rol en italic, línea mono abajo. Nav sticky arriba. Footer al final con CTA "Construyamos algo". `/en/` debe mostrar la versión en inglés.

- [ ] **Paso 13.3: Commit**

```bash
git add src/pages/[lang]/index.astro
git commit -m "feat(pages): home /es/ y /en/"
```

---

## Tarea 14: Placeholders de Works, About, Insights

**Archivos:**
- Crear: `src/pages/[lang]/works/index.astro`
- Crear: `src/pages/[lang]/about.astro`
- Crear: `src/pages/[lang]/insights/index.astro`

- [ ] **Paso 14.1: Crear `src/pages/[lang]/works/index.astro`**

```astro
---
import BaseLayout from '../../../layouts/BaseLayout.astro';
import { t, locales, isLocale, type Locale } from '../../../lib/i18n';

export function getStaticPaths() {
  return locales.map((lang) => ({ params: { lang } }));
}

const { lang: rawLang } = Astro.params;
if (!isLocale(rawLang)) throw new Error(`Invalid locale: ${rawLang}`);
const lang: Locale = rawLang;
---

<BaseLayout
  title={t('works.all', lang)}
  description={lang === 'es' ? 'Listado completo de proyectos.' : 'Full projects index.'}
  lang={lang}
>
  <section class="page">
    <h1>{t('works.all', lang)}</h1>
    <p>Coming soon.</p>
  </section>
</BaseLayout>

<style>
  .page {
    padding: 8rem var(--pad-x);
    max-width: var(--max-w);
    margin: 0 auto;
  }
  .page h1 {
    font-family: var(--font-serif);
    font-size: var(--fs-h1);
    font-weight: 400;
    margin: 0 0 2rem;
  }
  .page p {
    color: var(--fg-muted);
    font-family: var(--font-mono);
    font-size: var(--fs-small);
  }
</style>
```

- [ ] **Paso 14.2: Crear `src/pages/[lang]/about.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { t, locales, isLocale, type Locale } from '../../lib/i18n';

export function getStaticPaths() {
  return locales.map((lang) => ({ params: { lang } }));
}

const { lang: rawLang } = Astro.params;
if (!isLocale(rawLang)) throw new Error(`Invalid locale: ${rawLang}`);
const lang: Locale = rawLang;
---

<BaseLayout
  title={t('nav.about', lang)}
  description={lang === 'es' ? 'Sobre Joschua Barahona.' : 'About Joschua Barahona.'}
  lang={lang}
>
  <section class="page">
    <h1>{t('nav.about', lang)}</h1>
    <p>Coming soon.</p>
  </section>
</BaseLayout>

<style>
  .page {
    padding: 8rem var(--pad-x);
    max-width: var(--max-w);
    margin: 0 auto;
  }
  .page h1 {
    font-family: var(--font-serif);
    font-size: var(--fs-h1);
    font-weight: 400;
    margin: 0 0 2rem;
  }
  .page p {
    color: var(--fg-muted);
    font-family: var(--font-mono);
    font-size: var(--fs-small);
  }
</style>
```

- [ ] **Paso 14.3: Crear `src/pages/[lang]/insights/index.astro`**

```astro
---
import BaseLayout from '../../../layouts/BaseLayout.astro';
import { t, locales, isLocale, type Locale } from '../../../lib/i18n';

export function getStaticPaths() {
  return locales.map((lang) => ({ params: { lang } }));
}

const { lang: rawLang } = Astro.params;
if (!isLocale(rawLang)) throw new Error(`Invalid locale: ${rawLang}`);
const lang: Locale = rawLang;
---

<BaseLayout
  title={t('nav.insights', lang)}
  description={lang === 'es' ? 'Artículos sobre desarrollo y proceso.' : 'Articles on development and process.'}
  lang={lang}
>
  <section class="page">
    <h1>{t('nav.insights', lang)}</h1>
    <p>Coming soon.</p>
  </section>
</BaseLayout>

<style>
  .page {
    padding: 8rem var(--pad-x);
    max-width: var(--max-w);
    margin: 0 auto;
  }
  .page h1 {
    font-family: var(--font-serif);
    font-size: var(--fs-h1);
    font-weight: 400;
    margin: 0 0 2rem;
  }
  .page p {
    color: var(--fg-muted);
    font-family: var(--font-mono);
    font-size: var(--fs-small);
  }
</style>
```

- [ ] **Paso 14.4: Verificar en navegador**

```bash
pnpm dev
```
Visitar:
- `http://localhost:4321/` → redirect a `/es/`
- `/es/works/` → placeholder
- `/es/about/` → placeholder
- `/es/insights/` → placeholder
- `/en/works/`, `/en/about/`, `/en/insights/` → versiones en inglés
- Click en el selector ES/EN en cualquier página → cambia de idioma preservando la ruta
- Nav debe verse correctamente con mix-blend

`Ctrl+C`.

- [ ] **Paso 14.5: Commit**

```bash
git add src/pages/[lang]/
git commit -m "feat(pages): placeholders de works, about e insights"
```

---

## Tarea 15: Verificación final

- [ ] **Paso 15.1: Build de producción**

```bash
pnpm build
```
Esperado: build completa sin errores. Se genera `dist/`.

- [ ] **Paso 15.2: Preview del build**

```bash
pnpm preview
```
Abrir `http://localhost:4321/`. Revisar que todas las rutas funcionan igual que en `dev`. `Ctrl+C`.

- [ ] **Paso 15.3: Type check estricto**

```bash
pnpm check
```
Esperado: 0 errores, 0 warnings.

- [ ] **Paso 15.4: Verificar que `dist/` no se commitea**

```bash
git status
```
Esperado: `dist/`, `node_modules/`, `.astro/` todos ignorados (sale clean).

- [ ] **Paso 15.5: Commit final de verificación**

No debería haber cambios que commitear. Si los hay, investigar qué se coló.

```bash
git log --oneline
```
Esperado: lista limpia de commits, sin co-authors, sin menciones de IA.

---

## Checklist de cobertura del spec

Este plan cubre estas secciones del spec:

| Sección del spec | Cubierto en | Notas |
|---|---|---|
| 1. Arquitectura (stack, rutas, estructura) | Tareas 1, 2, 12, 13, 14 | ✓ |
| 2. Sistema visual (paleta, tipografía, tokens) | Tareas 3, 4 | ✓ |
| 3. Anatomía — Home | Tarea 13 | Estructura básica; animaciones en plan siguiente |
| 3. Anatomía — Works/About/Insights | Tarea 14 | Placeholders; contenido real en planes siguientes |
| 4. Animaciones | — | Plan siguiente (Lenis, GSAP, View Transitions, cursor) |
| 5. Content collections | Tarea 6 | Schemas listos; contenido real se añade después |
| 6. Performance/SEO/a11y | Tareas 4, 11 | Fundamentos (tokens a11y, meta tags, hreflang, skip link); audit completo en plan posterior |
| 7. Deploy | — | Plan siguiente (Vercel, dominio, Lighthouse CI) |

**Entregables al terminar este plan:**
- Sitio corriendo en `localhost:4321` con routing bilingüe funcional.
- Design tokens y tipografía aplicados globalmente.
- Nav sticky con mix-blend, footer con CTA, skip link accesible.
- Schemas de contenido listos para recibir proyectos y posts.
- Placeholders en todas las rutas principales.
- 0 JS en cliente (Astro envía HTML puro).
- Commits limpios, sin trazas de IA.

**Próximo plan:** `docs/plans/2026-04-24-home-works.md` — proyectos reales, lista de trabajos, detalle de proyecto, y primeras animaciones (Lenis + fade-ins).
