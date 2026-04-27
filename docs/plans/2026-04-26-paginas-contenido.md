# Plan 2 — Páginas con contenido real

**Rama:** `feat/contenido`  
**Rama base:** `feat/foundation`  
**Objetivo:** Pasar de páginas placeholder a páginas reales con contenido de los 4 proyectos, grid de trabajos, página de detalle, y animaciones base (Lenis + GSAP).

---

## Contexto del proyecto

- **Stack:** Astro 4 + TypeScript strict + Tailwind v4 + MDX
- **i18n:** nativo de Astro, `prefixDefaultLocale: true`, locales `['es', 'en']`
- **Design tokens:** `src/styles/tokens.css` (--bg #0A0A0A, --accent #E8E3D8, --fg #EDEDED, --fg-muted #8A8A8A, --line rgba(255,255,255,0.08))
- **Fuentes:** --font-serif (Fraunces), --font-sans (Geist Sans), --font-mono (Geist Mono)
- **Regla estética crítica:** cero border-radius en ningún elemento de UI, sin colores brillantes
- **Content collections:** `projects` y `posts` definidas en `src/content/config.ts`
- **Helper i18n:** `t(key, lang)` en `src/lib/i18n.ts` con fallback a `en`

### Archivos clave existentes

```
src/
  layouts/BaseLayout.astro      — HTML shell completo con Nav + Footer
  components/Nav.astro          — Sticky, mix-blend-mode: difference
  components/Footer.astro       — CTA + email + sociales
  components/Meta.astro         — Items de metadatos en monospace
  components/LangSwitcher.astro — Toggle ES/EN
  lib/i18n.ts                   — t(), isLocale(), switchLocale(), locales
  i18n/es.json + en.json        — Strings de UI
  styles/tokens.css             — Design tokens (CSS custom properties)
  styles/global.css             — @theme Tailwind, reset, prefers-reduced-motion
  content/config.ts             — Zod schemas para projects y posts
  pages/[lang]/index.astro      — Home (hero OK, works section = placeholder)
  pages/[lang]/works/index.astro — Works listing (placeholder)
  pages/[lang]/about.astro       — About (placeholder)
  pages/[lang]/insights/index.astro — Insights (placeholder)
```

### Schema de projects (src/content/config.ts)

```typescript
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
```

---

## Los 4 proyectos reales

### 1. Agenda IA
- **Qué es:** SaaS multi-tenant de agendamiento por WhatsApp impulsado por IA. Un bot recibe mensajes de texto natural en WhatsApp ("quiero una cita el lunes a las 10"), los procesa con Claude AI, y crea la cita en Google Calendar, notificando al paciente/cliente por WhatsApp. Panel de administración en React para gestionar negocios.
- **Año:** 2025
- **Rol:** Desarrollador Fullstack / Full Stack Developer
- **Stack:** Frontend: React, Vite, TypeScript | Backend: Node.js, Express, Socket.IO, Redis, MySQL | Infra: WhatsApp Cloud API, Claude AI (Anthropic), Google Calendar API
- **Category:** `web-app`
- **Slug:** `agenda-ia`
- **Number:** 1
- **Featured:** true
- **Description ES:** SaaS de agendamiento inteligente vía WhatsApp. El bot entiende lenguaje natural y confirma citas en Google Calendar.
- **Description EN:** AI-powered WhatsApp scheduling SaaS. The bot understands natural language and confirms appointments in Google Calendar.

### 2. POS Tree Codes
- **Qué es:** Suite empresarial híbrida de punto de venta para Costa Rica. Incluye: app desktop Java Swing para caja, WebPOS en PHP para puntos adicionales, API REST en Spring Boot, y facturación electrónica certificada ante la DGT (Dirección General de Tributación) según norma DGT-R-48-2016. 57 tablas en la BD, 250+ clases Java.
- **Año:** 2024
- **Rol:** Desarrollador Fullstack / Full Stack Developer
- **Stack:** Frontend: Java 21 Swing, PHP | Backend: Spring Boot 3.5, MySQL 8 | Infra: DGT API (facturación electrónica CR)
- **Category:** `tool`
- **Slug:** `pos-tree-codes`
- **Number:** 2
- **Featured:** true
- **Description ES:** Suite POS empresarial híbrida con facturación electrónica certificada para Costa Rica. Desktop Java + WebPOS + API REST.
- **Description EN:** Hybrid enterprise POS suite with certified electronic invoicing for Costa Rica. Java desktop + WebPOS + REST API.

### 3. TreeCodes Hub
- **Qué es:** Aplicación desktop que funciona como launcher y gestor del ecosistema de aplicaciones TreeCodes. Instala, actualiza y lanza productos TreeCodes con validación de licencias y verificación de firma digital.
- **Año:** 2024
- **Rol:** Desarrollador Fullstack / Full Stack Developer
- **Stack:** Frontend: Java 21 Swing | Backend: Spring Boot
- **Category:** `tool`
- **Slug:** `treecodes-hub`
- **Number:** 3
- **Featured:** false
- **Description ES:** Launcher desktop para el ecosistema TreeCodes. Gestiona instalación, actualizaciones y licencias con verificación de firma digital.
- **Description EN:** Desktop launcher for the TreeCodes ecosystem. Manages installations, updates, and licenses with digital signature verification.

### 4. Aura Pura Perfumería
- **Qué es:** Catálogo web para perfumería artesanal. Frontend con Flask/Jinja y efectos visuales modernos (modales, animaciones CSS). API RESTful en Flask. Admin desktop en Python Tkinter para gestión de productos.
- **Año:** 2024
- **Rol:** Desarrollador Fullstack / Full Stack Developer
- **Stack:** Frontend: Flask/Jinja, CSS | Backend: Flask, MySQL | Infra: Python Tkinter (admin desktop)
- **Category:** `web-app`
- **Slug:** `aura-pura`
- **Number:** 4
- **Featured:** false
- **Description ES:** Catálogo web de perfumería artesanal con admin desktop. API RESTful, modales de producto y efectos visuales modernos.
- **Description EN:** Artisanal perfume catalog web app with desktop admin. RESTful API, product modals, and modern visual effects.

---

## Tareas

---

### Tarea 1: Schema cover opcional + MDX content files

**Objetivo:** Crear los archivos MDX de los 4 proyectos en ES y EN. Las imágenes reales aún no existen (las generará Gemini), por lo que `cover` y `coverHover` se vuelven temporalmente opcionales en el schema para poder desarrollar sin imágenes.

**Archivos a crear/modificar:**

1. `src/content/config.ts` — cambiar `cover: image()` a `cover: image().optional()` y `coverHover: image().optional()` (ya es opcional)

2. `src/content/projects/es/agenda-ia/index.mdx`
3. `src/content/projects/es/pos-tree-codes/index.mdx`
4. `src/content/projects/es/treecodes-hub/index.mdx`
5. `src/content/projects/es/aura-pura/index.mdx`
6. `src/content/projects/en/agenda-ia/index.mdx`
7. `src/content/projects/en/pos-tree-codes/index.mdx`
8. `src/content/projects/en/treecodes-hub/index.mdx`
9. `src/content/projects/en/aura-pura/index.mdx`

**Formato del frontmatter MDX (ejemplo para agenda-ia ES):**

```mdx
---
title: "Agenda IA"
slug: "agenda-ia"
lang: "es"
number: 1
year: 2025
role: ["Desarrollador Fullstack"]
category: "web-app"
stack:
  frontend: ["React", "Vite", "TypeScript"]
  backend: ["Node.js", "Express", "Socket.IO", "Redis", "MySQL"]
  infra: ["WhatsApp Cloud API", "Claude AI", "Google Calendar API"]
featured: true
draft: false
description: "SaaS de agendamiento inteligente vía WhatsApp. El bot entiende lenguaje natural y confirma citas en Google Calendar."
publishedAt: 2025-01-15
---

## El problema

Los negocios con citas —consultorios, spas, barberías— pierden tiempo y clientes gestionando agendas manualmente por WhatsApp.

## La solución

Agenda IA intercepta los mensajes de WhatsApp de tus clientes, los procesa con inteligencia artificial y confirma la cita automáticamente en Google Calendar, 24/7, sin intervención humana.

## Arquitectura

El backend en Node.js orquesta tres servicios: WhatsApp Cloud API para mensajería, Claude AI para comprensión del lenguaje natural, y Google Calendar API para la creación de eventos. Redis maneja la cola de mensajes y las sesiones de conversación. El panel de administración en React permite a cada negocio configurar su disponibilidad y ver sus citas.

## Resultado

Un bot que entiende "quiero una cita el lunes a las 3" y responde con la confirmación y recordatorios automáticos.
```

**Notas:**
- El body del MDX puede ser breve — 3-4 párrafos que describan el problema, la solución, la arquitectura y el resultado. Narrativa técnica, no marketing.
- Sin `cover` ni `coverHover` en el frontmatter por ahora (son opcionales).
- Las fechas `publishedAt` van en formato `YYYY-MM-DD` en el frontmatter YAML.
- Los archivos EN son el mismo contenido traducido al inglés.

**Criterio de aceptación:**
- `pnpm run build` completa sin errores TypeScript
- Las 8 colecciones (4 ES + 4 EN) son accesibles via `getCollection('projects')`

---

### Tarea 2: Componente ProjectCard + Home grid

**Objetivo:** Crear el componente `ProjectCard` y reemplazar el placeholder en la Home con el grid real de proyectos, con efecto hover dual (imagen principal ↔ imagen hover) usando solo CSS.

**Archivos a crear/modificar:**
1. `src/components/ProjectCard.astro` — componente de tarjeta de proyecto
2. `src/pages/[lang]/index.astro` — reemplazar sección `.works` placeholder

**Especificación del ProjectCard:**

```
Estructura visual de una tarjeta:
┌─────────────────────────────────┐
│                                 │
│    IMAGEN (aspect-ratio 16/10)  │ ← cover o bg dark si no hay imagen
│    (hover: muestra coverHover)  │
│                                 │
├─────────────────────────────────┤
│ 01              web-app         │ ← número (mono) + categoria (mono)
│                                 │
│ Agenda IA                       │ ← título (serif)
│                                 │
│ 2025                            │ ← año (mono, muted)
└─────────────────────────────────┘
```

**Comportamiento hover:**
- La imagen del card hace crossfade: `cover` → `coverHover` al hacer hover sobre el card
- Implementado con CSS: dos `<img>` superpuestos (absolute position), la segunda con `opacity: 0` que pasa a `opacity: 1` en hover del card
- Si no hay `cover`, mostrar fondo `var(--bg-elev)` (dark placeholder)
- Si no hay `coverHover`, no mostrar segunda imagen (el crossfade no activa)
- El card entero es clickeable (link a la página de detalle)
- `transition: opacity 400ms var(--ease-out)` en la imagen hover

**Grid en la Home:**
- 2 columnas en desktop, 1 columna en móvil
- Mostrar solo proyectos con `featured: true` y `draft: false`, del locale actual
- Ordenar por `number` ascendente
- Debajo del grid: link "Ver todos los trabajos →" en monospace apuntando a `/{lang}/works/`

**Criterio de aceptación:**
- Grid muestra los proyectos featured en el locale correcto
- El hover del card hace crossfade visual (verificable en el browser)
- Cero border-radius en todo el componente
- Ningún error de TypeScript

---

### Tarea 3: Works listing page

**Objetivo:** Reemplazar el placeholder en `/works/` con un grid completo de todos los proyectos.

**Archivos a modificar:**
1. `src/pages/[lang]/works/index.astro`

**Especificación:**

- Hero minimal arriba: número de sección "02" + título `{t('works.all', lang)}` en serif grande
- Grid de todos los proyectos (`draft: false`) del locale actual, ordenados por `number`
- Usar el mismo componente `ProjectCard` de la Tarea 2
- 2 columnas en desktop ≥ 768px, 1 columna en móvil
- Sin filtros por ahora — solo todos los proyectos

**Criterio de aceptación:**
- Muestra los 4 proyectos correctamente
- Mismo componente que la Home, consistente visualmente

---

### Tarea 4: Works detail page

**Objetivo:** Crear la página de detalle de proyecto con todas las secciones.

**Archivo a crear:**
1. `src/pages/[lang]/works/[slug].astro`

**Especificación de la página:**

```
Layout:
┌──────────────────────────────────────────────┐
│  NAV                                         │
├──────────────────────────────────────────────┤
│                                              │
│  HERO IMAGE (full width, aspect 16/10)       │ ← cover image si existe; si no, bg dark
│                                              │
├──────────────┬───────────────────────────────┤
│  METADATA    │  TÍTULO + DESCRIPCIÓN         │
│  sidebar     │                               │
│  (1/3)       │  (2/3)                        │
│              │                               │
│  Año: 2025   │  [Título en serif grande]     │
│  Rol: ...    │                               │
│  Cliente: —  │  [Descripción]                │
│  Stack:      │                               │
│    Frontend  │                               │
│    Backend   │                               │
│    Infra     │                               │
│              │                               │
│  [URL]       │                               │
│  [Repo]      │                               │
├──────────────┴───────────────────────────────┤
│  CONTENIDO MDX (prose)                       │
│  (tipografía legible, ancho máximo ~65ch)    │
├──────────────────────────────────────────────┤
│  GALERÍA (si hay imágenes)                   │
│  Grid 2 columnas de imágenes                 │
├──────────────────────────────────────────────┤
│  NEXT PROJECT                                │
│  "Siguiente →  [Título del siguiente]"       │
│  (en mono, link al siguiente por número)     │
├──────────────────────────────────────────────┤
│  FOOTER                                      │
└──────────────────────────────────────────────┘
```

**Notas técnicas:**
- `getStaticPaths` genera rutas para todos los proyectos del locale `lang` con `draft: false`
- Para "Siguiente proyecto": ordenar todos los proyectos por número, envolver (el último apunta al primero)
- La sidebar de metadata en desktop es sticky (position: sticky, top: 6rem)
- En móvil: metadata va arriba, contenido abajo (stack vertical)
- El MDX content se renderiza con `<Content />` del entry
- Usar `<Image>` de `astro:assets` para las imágenes del cover y gallery
- Labels de metadata en monospace uppercase small (`var(--fs-small)`, color `var(--fg-subtle)`)
- Valores en mono normal (`var(--fg-muted)`)
- URL y repo como links en mono
- `<title>` de la página: `{project.data.title} — Joschua Barahona`

**Criterio de aceptación:**
- Las 4 páginas de detalle renderizan sin errores
- La metadata lateral está completa (año, rol, stack)
- El link "Siguiente" funciona y envuelve correctamente
- `pnpm run build` sin errores

---

### Tarea 5: Lenis smooth scroll + GSAP fade-in reveals

**Objetivo:** Instalar y configurar Lenis para scroll suave, y GSAP para animaciones de entrada (fade-up) al hacer scroll.

**Paquetes a instalar:**
```
pnpm add lenis gsap
```

**Archivos a crear/modificar:**
1. `src/components/SmoothScroll.astro` — componente de inicialización client-side
2. `src/layouts/BaseLayout.astro` — importar `SmoothScroll` antes del cierre de `</body>`
3. `src/styles/global.css` — agregar clase utility `.reveal` para elementos animados

**Especificación técnica:**

`SmoothScroll.astro`:
- Script `<script>` con `is:inline` (no procesado por Vite, para evitar issues de SSR)
- Inicializar Lenis: `new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })`
- RAF loop para Lenis (requestAnimationFrame)
- Inicializar GSAP ScrollTrigger: `ScrollTrigger.create` en todos los elementos `.reveal`
- Animación reveal: `opacity: 0, y: 24` → `opacity: 1, y: 0`, duration `0.7s`, ease `power2.out`
- Respetar `prefers-reduced-motion`: si `window.matchMedia('(prefers-reduced-motion: reduce)').matches`, no inicializar ninguna animación (los elementos `.reveal` ya están visibles via CSS `@media (prefers-reduced-motion: reduce) { .reveal { opacity: 1 !important; transform: none !important; } }`)
- Integrar Lenis con GSAP: `lenis.on('scroll', ScrollTrigger.update)` y `gsap.ticker.add((time) => lenis.raf(time * 1000))`

Clase `.reveal` en CSS:
```css
.reveal {
  opacity: 0;
  transform: translateY(24px);
}
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; }
}
```

**Dónde aplicar `.reveal`:**
- En `index.astro`: la sección `.hero` y la sección `.works` llevan la clase `.reveal`
- En `ProjectCard.astro`: el card entero lleva `.reveal` con `data-reveal-delay` que el script usa como `stagger`
- En `works/index.astro`: el hero y cada card

**Stagger en los cards:**
- Los ProjectCards dentro del grid reciben un pequeño delay incremental: el subagent puede implementar esto añadiendo `style="--delay: {index * 0.08}s"` y usando esa var en GSAP, o simplemente usando `gsap.utils.toArray('.reveal')` con `stagger: 0.08` en un `gsap.from` con ScrollTrigger.

**Criterio de aceptación:**
- Scroll suave funciona en el browser
- Las secciones de la Home aparecen con fade-up al cargar y al hacer scroll
- Con `prefers-reduced-motion: reduce` todo es inmediatamente visible, sin animaciones
- No hay errores en consola del browser
- `pnpm run build` sin errores

---

## Orden de ejecución

1. Tarea 1 (content MDX) — base que necesitan todas las demás
2. Tarea 2 (ProjectCard + Home) — componente core
3. Tarea 3 (Works listing) — reutiliza ProjectCard
4. Tarea 4 (Works detail) — ruta dinámica, necesita el content de T1
5. Tarea 5 (Lenis + GSAP) — capa encima de todo lo anterior

## Fuera de alcance (Plan 3)

- Página About (espera foto de perfil)
- Página Insights/blog (espera posts reales)
- Cursor personalizado
- Animaciones avanzadas (morphing, View Transitions entre páginas)
- OG Image con Satori
