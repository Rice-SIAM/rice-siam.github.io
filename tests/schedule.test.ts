import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  academicYearStartYear,
  isListedPast,
  isListingClosed,
  listedUntil,
  listingClosesAt,
} from '../src/utils/schedule.ts'

describe('timed events', () => {
  const start = new Date('2026-10-01T17:30:00-05:00')
  const end = new Date('2026-10-01T19:30:00-05:00')
  const gameNight = { start, end }

  it('keeps the offset as an absolute instant', () => {
    assert.equal(end.toISOString(), '2026-10-02T00:30:00.000Z')
    assert.equal(listedUntil(gameNight).toISOString(), '2026-10-02T00:30:00.000Z')
  })

  it('stays listed through the end instant and drops one millisecond later', () => {
    assert.equal(isListedPast(gameNight, new Date(end.getTime() - 60_000)), false)
    assert.equal(isListedPast(gameNight, end), false)
    assert.equal(isListedPast(gameNight, new Date(end.getTime() + 1)), true)
  })

  it('uses the start when end is omitted', () => {
    const pubNight = { start: new Date('2026-09-17T17:30:00-05:00') }
    assert.equal(listedUntil(pubNight).toISOString(), '2026-09-17T22:30:00.000Z')
    assert.equal(isListedPast(pubNight, new Date('2026-09-17T22:30:00.000Z')), false)
    assert.equal(isListedPast(pubNight, new Date('2026-09-17T22:30:00.001Z')), true)
  })
})

describe('all-day ranges', () => {
  const workshop = {
    start: new Date('2026-10-02'),
    end: new Date('2026-10-03'),
    allDay: true,
  }

  it('stays listed through the end of the last UTC day', () => {
    assert.equal(listedUntil(workshop).toISOString(), '2026-10-03T23:59:59.999Z')
    assert.equal(isListedPast(workshop, new Date('2026-10-03T23:59:59.999Z')), false)
    assert.equal(isListedPast(workshop, new Date('2026-10-04T00:00:00.000Z')), true)
  })

  it('uses the start day when end is omitted', () => {
    const barbecue = { start: new Date('2021-11-20'), allDay: true }
    assert.equal(listedUntil(barbecue).toISOString(), '2021-11-20T23:59:59.999Z')
  })
})

describe('opportunity listings', () => {
  it('keeps a date-only deadline through that UTC day', () => {
    const deadline = new Date('2026-10-23')
    assert.equal(listingClosesAt(deadline).toISOString(), '2026-10-23T23:59:59.999Z')
    assert.equal(isListingClosed(deadline, undefined, new Date('2026-10-23T12:00:00.000Z')), false)
    assert.equal(isListingClosed(deadline, undefined, new Date('2026-10-24T00:00:00.000Z')), true)
  })

  it('closes at the earlier of deadline and removeAfter', () => {
    const deadline = new Date('2026-12-01')
    const removeAfter = new Date('2026-11-01T15:00:00.000Z')
    assert.equal(listingClosesAt(deadline, removeAfter).toISOString(), '2026-11-01T15:00:00.000Z')
    assert.equal(isListingClosed(deadline, removeAfter, new Date('2026-11-01T15:00:00.000Z')), false)
    assert.equal(isListingClosed(deadline, removeAfter, new Date('2026-11-01T15:00:00.001Z')), true)
  })
})

describe('academic year', () => {
  it('starts in August, using Chicago for timed events and UTC for all-day events', () => {
    assert.equal(academicYearStartYear(new Date('2026-10-01T17:30:00-05:00'), false), 2026)
    assert.equal(academicYearStartYear(new Date('2026-01-15T12:00:00-06:00'), false), 2025)
    assert.equal(academicYearStartYear(new Date('2026-08-01T00:30:00.000Z'), false), 2025)
    assert.equal(academicYearStartYear(new Date('2026-08-01T12:00:00-05:00'), false), 2026)
    assert.equal(academicYearStartYear(new Date('2026-08-01'), true), 2026)
    assert.equal(academicYearStartYear(new Date('2026-07-31'), true), 2025)
  })
})
