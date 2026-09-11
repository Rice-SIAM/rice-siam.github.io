import { parse } from 'yaml'
import officersYaml from '../data/officers.yaml?raw'
import officersHistoryYaml from '../data/officers-history.yaml?raw'
import partnersYaml from '../data/partners.yaml?raw'
import navigationYaml from '../data/navigation.yaml?raw'
import socialYaml from '../data/social.yaml?raw'
import siteYaml from '../data/site.yaml?raw'
import newsletterYaml from '../data/newsletter.yaml?raw'

const files = {
  'officers.yaml': officersYaml,
  'officers-history.yaml': officersHistoryYaml,
  'partners.yaml': partnersYaml,
  'navigation.yaml': navigationYaml,
  'social.yaml': socialYaml,
  'site.yaml': siteYaml,
  'newsletter.yaml': newsletterYaml,
} as const

export type DataFile = keyof typeof files

/**
 * Parse a YAML data file. Invalid YAML causes the build to fail, which is intentional.
 */
export function loadYaml<T>(filename: DataFile): T {
  return parse(files[filename]) as T
}
