import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const events = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/events' }),
  schema: z
    .object({
      title: z.string(),
      start: z.coerce.date(),
      end: z.coerce.date().optional(),
      location: z.string().optional(),
      summary: z.string(),
      registrationUrl: z.string().url().optional(),
      calendarUrl: z.string().url().optional(),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    })
    .refine((event) => !event.image || Boolean(event.imageAlt), {
      message: 'imageAlt is required when image is set',
      path: ['imageAlt'],
    }),
})

export const collections = { events }
