import { defineThemeConfig } from '@utils/defineThemeConfig'
import { getSite, getNavigation, getSocials } from '@utils/siteData'
import logoImage from '@assets/img/logo.svg'
import previewImage from '@assets/img/social-preview.svg'

const site = getSite()

export default defineThemeConfig({
  name: site.name,
  shortName: site.shortName,
  id: site.id,
  github: site.github,
  logo: logoImage,
  seo: {
    title: site.seo.title,
    description: site.seo.description,
    author: site.seo.author,
    image: previewImage,
  },
  colors: {
    primary: '#00205B',
    secondary: '#5C6770',
    neutral: '#8A8D8F',
    outline: '#C45C00',
  },
  navigation: getNavigation(),
  socials: getSocials(),
})
