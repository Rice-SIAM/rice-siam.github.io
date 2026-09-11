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
      allDay: z.boolean().default(false),
      draft: z.boolean().default(false),
    })
    .refine((event) => !event.image || Boolean(event.imageAlt), {
      message: 'imageAlt is required when image is set',
      path: ['imageAlt'],
    }),
})

const opportunityTypes = ['internship', 'postdoc', 'fellowship', 'job'] as const
const opportunityLevels = ['undergraduate', 'graduate', 'both'] as const

const opportunities = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/opportunities' }),
  schema: z
    .object({
      title: z.string(),
      organization: z.string(),
      type: z.enum(opportunityTypes),
      level: z.enum(opportunityLevels).optional(),
      location: z.string().optional(),
      audience: z.string().optional(),
      url: z.string().url(),
      summary: z.string(),
      deadline: z.coerce.date().optional(),
      removeAfter: z.coerce.date().optional(),
      draft: z.boolean().default(false),
    })
    .refine((opportunity) => Boolean(opportunity.deadline || opportunity.removeAfter), {
      message: 'deadline or removeAfter is required so listings do not stay up indefinitely',
      path: ['removeAfter'],
    })
    .refine((opportunity) => opportunity.type !== 'internship' || Boolean(opportunity.level), {
      message: 'level is required for internships (undergraduate, graduate, or both)',
      path: ['level'],
    }),
})

export const collections = { events, opportunities }
