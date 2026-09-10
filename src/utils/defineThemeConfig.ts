import type { ImageMetadata } from 'astro'

export type NavigationItem =
  | {
      type?: 'link'
      label: string
      href: string
      external?: boolean
      highlight?: boolean
      icon?: string
    }
  | {
      type: 'dropdown'
      label: string
      icon?: string
      items: {
        label: string
        href: string
        external?: boolean
      }[]
    }

export type SocialItem = {
  label: string
  href: string
  icon: string
  external?: boolean
}

export type ThemeConfig = {
  name: string
  shortName?: string
  id: string
  logo?: ImageMetadata | null
  seo: {
    title: string
    subtitle?: string
    description?: string
    author?: string
    image?: ImageMetadata | string | null
  }
  colors: {
    primary: string
    secondary: string
    neutral: string
    outline: string
  }
  navigation: {
    darkmode?: boolean
    items: NavigationItem[]
  }
  socials?: SocialItem[]
}

const defaultConfig: Omit<ThemeConfig, 'name' | 'id'> = {
  seo: {
    title: 'Rice University SIAM Student Chapter',
    subtitle: '',
    description:
      "Rice University's student chapter of the Society for Industrial and Applied Mathematics, supporting students interested in applied mathematics, computational science, scientific computing, and related fields.",
    author: 'Rice University SIAM Student Chapter',
    image: null,
  },
  colors: {
    primary: '#00205B',
    secondary: '#7C7E7F',
    neutral: '#7C7E7F',
    outline: '#C45C00',
  },
  navigation: {
    darkmode: true,
    items: [],
  },
  socials: [],
}

export function defineThemeConfig(config: ThemeConfig): ThemeConfig {
  return {
    ...config,
    seo: {
      ...defaultConfig.seo,
      ...config.seo,
    },
    colors: {
      ...defaultConfig.colors,
      ...config.colors,
    },
    socials: config.socials ?? defaultConfig.socials,
    navigation: {
      ...defaultConfig.navigation,
      ...config.navigation,
    },
  }
}
