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
    // TODO: Verify these values against Rice University's official brand guide
    // before treating them as official. #00205B is commonly cited as Rice Blue
    // (Pantone 289). #5C6770 is a restrained gray for secondary UI, not a claimed
    // Rice trademark color. #C45C00 is a high-contrast focus color chosen for
    // accessibility, not an official Rice color.
    primary: '#00205B',
    secondary: '#5C6770',
    neutral: '#8A8D8F',
    outline: '#C45C00',
  },
  navigation: getNavigation(),
  socials: getSocials(),
})
