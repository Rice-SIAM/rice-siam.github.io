import { defineThemeConfig } from '@utils/defineThemeConfig'
import { getSite, getNavigation, getSocials } from '@utils/siteData'
import { SITE_COLORS } from '@utils/brandColors'
import previewImage from '@assets/img/social-preview.svg'

const site = getSite()

export default defineThemeConfig({
  name: site.name,
  shortName: site.shortName,
  id: site.id,
  seo: {
    title: site.seo.title,
    description: site.seo.description,
    author: site.seo.author,
    image: previewImage,
  },
  colors: {
    primary: SITE_COLORS.riceBlue,
    secondary: SITE_COLORS.riceGray,
    neutral: SITE_COLORS.riceGray,
    outline: SITE_COLORS.focus,
  },
  navigation: getNavigation(),
  socials: getSocials(),
})
