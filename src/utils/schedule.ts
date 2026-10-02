export const CHICAGO_TIME_ZONE = 'America/Chicago'

const ACADEMIC_YEAR_START_MONTH = 8

export type ListedRange = {
  start: Date
  end?: Date
  allDay?: boolean
}

export function chicagoDateKey(date: Date): string {
  return date.toLocaleDateString('en-CA', { timeZone: CHICAGO_TIME_ZONE })
}

function endOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999))
}

export function isUtcDateOnly(date: Date): boolean {
  return (
    date.getUTCHours() === 0 &&
    date.getUTCMinutes() === 0 &&
    date.getUTCSeconds() === 0 &&
    date.getUTCMilliseconds() === 0
  )
}

/** Last instant an item stays on an upcoming list. The exact instant is still listed. */
export function listedUntil(item: ListedRange): Date {
  const end = item.end ?? item.start
  if (item.allDay) {
    return endOfUtcDay(end)
  }

  return end
}

export function isListedPast(item: ListedRange, asOf: Date): boolean {
  return listedUntil(item) < asOf
}

function listingInstant(date: Date): Date {
  return isUtcDateOnly(date) ? endOfUtcDay(date) : date
}

/** Earlier of deadline and removeAfter. A UTC-midnight value stays up through that UTC day. */
export function listingClosesAt(deadline?: Date, removeAfter?: Date): Date {
  const ends = [deadline, removeAfter].filter((value): value is Date => value instanceof Date).map(listingInstant)
  if (ends.length === 0) {
    throw new Error('deadline or removeAfter is required')
  }

  return new Date(Math.min(...ends.map((value) => value.valueOf())))
}

export function isListingClosed(deadline: Date | undefined, removeAfter: Date | undefined, asOf: Date): boolean {
  return listingClosesAt(deadline, removeAfter) < asOf
}

function eventCalendarDate(date: Date, allDay = false): { year: number; month: number } {
  if (allDay) {
    return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1 }
  }

  const [year, month] = chicagoDateKey(date).split('-').map(Number)
  return { year, month }
}

export function academicYearStartYear(date: Date, allDay = false): number {
  const { year, month } = eventCalendarDate(date, allDay)
  return month >= ACADEMIC_YEAR_START_MONTH ? year : year - 1
}

export function academicYearLabel(startYear: number): string {
  return `${startYear}–${startYear + 1}`
}

export function academicYearId(startYear: number): string {
  return `academic-year-${startYear}-${startYear + 1}`
}
