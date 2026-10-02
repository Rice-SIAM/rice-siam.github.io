export type OpportunityShape = {
  type: 'internship' | 'postdoc' | 'fellowship' | 'job'
  level?: 'undergraduate' | 'graduate' | 'both'
}

export type OpportunitySectionDef = {
  id: string
  title: string
  emptyMessage: string
  includes: (item: OpportunityShape) => boolean
}

export const OPPORTUNITY_SECTIONS: OpportunitySectionDef[] = [
  {
    id: 'graduate-internships',
    title: 'Graduate internships',
    emptyMessage: 'No graduate internships are listed.',
    includes: (item) => item.type === 'internship' && item.level === 'graduate',
  },
  {
    id: 'undergraduate-and-graduate-internships',
    title: 'Undergraduate and graduate internships',
    emptyMessage: 'No undergraduate and graduate internships are listed.',
    includes: (item) => item.type === 'internship' && item.level === 'both',
  },
  {
    id: 'undergraduate-internships',
    title: 'Undergraduate internships',
    emptyMessage: 'No undergraduate internships are listed.',
    includes: (item) => item.type === 'internship' && item.level === 'undergraduate',
  },
  {
    id: 'postdocs',
    title: 'Postdocs',
    emptyMessage: 'No postdocs are listed.',
    includes: (item) => item.type === 'postdoc',
  },
  {
    id: 'fellowships',
    title: 'Fellowships',
    emptyMessage: 'No fellowships are listed.',
    includes: (item) => item.type === 'fellowship',
  },
  {
    id: 'jobs',
    title: 'Jobs',
    emptyMessage: 'No jobs are listed.',
    includes: (item) => item.type === 'job',
  },
]
