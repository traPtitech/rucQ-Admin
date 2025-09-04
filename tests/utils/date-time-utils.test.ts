import * as utils from '@/utils/date-time-utils'
import { expect, it, describe } from 'vitest'

describe('Date Time Utils', () => {
  it('isValidDate', () => {
    expect(utils.isValidDate(new Date())).toBe(false)
    expect(utils.isValidDate('2021-01-01')).toBe(true)
    expect(utils.isValidDate('invalid-date')).toBe(false)
    expect(utils.isValidDate(null)).toBe(false)
    expect(utils.isValidDate(undefined)).toBe(false)
    expect(utils.isValidDate(12345)).toBe(false)
    expect(utils.isValidDate('2021-01-01T00:00:00Z')).toBe(true)
    expect(utils.isValidDate('2021-01-01T25:00:00Z')).toBe(false) // Invalid hour
  })
  it('isValidTime', () => {
    expect(utils.isValidTime('12:00')).toBe(true)
    expect(utils.isValidTime('25:00')).toBe(false)
    expect(utils.isValidTime('12:60')).toBe(false)
    expect(utils.isValidTime('invalid-time')).toBe(false)
    expect(utils.isValidTime(null)).toBe(false)
    expect(utils.isValidTime(undefined)).toBe(false)
    expect(utils.isValidTime(12345)).toBe(false)
  })
  it('combineDateAndTime', () => {
    expect(utils.combineDateAndTime('2021-01-01', '12:00')).toBe('2021-01-01T12:00:00+09:00')
  })
  it('isTimeAfterOrEqual', () => {
    expect(utils.isTimeAfterOrEqual('12:00')('12:00')).toBe(true)
    expect(utils.isTimeAfterOrEqual('12:01')('12:00')).toBe(false)
    expect(utils.isTimeAfterOrEqual('12:00')('12:01')).toBe(true)
    expect(utils.isTimeAfterOrEqual('invalid-time')('12:00')).toBe(false)
    expect(utils.isTimeAfterOrEqual('12:00')('invalid-time')).toBe(false)
  })
})
