import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      urlSlug: z.string(),
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
      cover: image().optional(),
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
      urlSlug: z.string(),
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
