import { z } from 'astro/zod'
import { loadYaml } from './loadYaml'
import type { NavigationItem, SocialItem } from './defineThemeConfig'

const SiteSchema = z.object({
  name: z.string(),
  shortName: z.string(),
  id: z.string(),
  header: z.object({
    title: z.string(),
  }),
  contactEmail: z.string().email().optional(),
  seo: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
  }),
})

const NavigationSchema = z.object({
  darkmode: z.boolean().default(true),
  items: z.array(
    z.union([
      z.object({
        type: z.literal('link').optional(),
        label: z.string(),
        href: z.string(),
        external: z.boolean().optional(),
        highlight: z.boolean().optional(),
        icon: z.string().optional(),
      }),
      z.object({
        type: z.literal('dropdown'),
        label: z.string(),
        icon: z.string().optional(),
        items: z.array(
          z.object({
            label: z.string(),
            href: z.string(),
            external: z.boolean().optional(),
          }),
        ),
      }),
    ]),
  ),
})

const SocialSchema = z.array(
  z.object({
    label: z.string(),
    href: z.string().url(),
    icon: z.string(),
    external: z.boolean().optional(),
  }),
)

const OfficerSchema = z
  .object({
    name: z.string(),
    role: z.string().optional(),
    term: z.string().optional(),
    email: z.string().email().optional(),
    photo: z.string().optional(),
    photoAlt: z.string().optional(),
    order: z.number().int().optional(),
  })
  .refine((officer) => !officer.photo || Boolean(officer.photoAlt), {
    message: 'photoAlt is required when photo is set',
    path: ['photoAlt'],
  })

const PartnerSchema = z
  .object({
    name: z.string(),
    url: z.string().url().optional(),
    logo: z.string().optional(),
    logoAlt: z.string().optional(),
    description: z.string().optional(),
  })
  .refine((partner) => !partner.logo || Boolean(partner.logoAlt), {
    message: 'logoAlt is required when logo is set',
    path: ['logoAlt'],
  })

export type SiteData = z.infer<typeof SiteSchema>
export type Officer = z.infer<typeof OfficerSchema>
export type Partner = z.infer<typeof PartnerSchema>

export function getSite(): SiteData {
  return SiteSchema.parse(loadYaml('site.yaml'))
}

export function getNavigation(): { darkmode: boolean; items: NavigationItem[] } {
  return NavigationSchema.parse(loadYaml('navigation.yaml')) as {
    darkmode: boolean
    items: NavigationItem[]
  }
}

export function getSocials(): SocialItem[] {
  return SocialSchema.parse(loadYaml('social.yaml'))
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase()
}

export function getOfficers(): Officer[] {
  return z
    .array(OfficerSchema)
    .parse(loadYaml('officers.yaml'))
    .slice()
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
}

export function getPartners(): Partner[] {
  return z.array(PartnerSchema).parse(loadYaml('partners.yaml'))
}
