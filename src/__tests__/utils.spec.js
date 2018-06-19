import { addOrSubtractMinutes, formatTime, parseTime } from '../utils'

describe('addOrSubtractMinutes', () => {
  it('adds minutes', () => {
    expect(addOrSubtractMinutes('5:30', 15)).toEqual('05:45')
  })

  it('subtracts minutes', () => {
    expect(addOrSubtractMinutes('5:30', -15)).toEqual('05:15')
  })

  it('increases the hours when a full hour is passed', () => {
    expect(addOrSubtractMinutes('5:30', 45)).toEqual('06:15')
  })

  it('decreases the hours when a full hour is passed', () => {
    expect(addOrSubtractMinutes('5:30', -45)).toEqual('04:45')
  })

  it('starts from 00:00 when a full day is passed', () => {
    expect(addOrSubtractMinutes('22:30', 90)).toEqual('00:00')
    expect(addOrSubtractMinutes('02:30', -155)).toEqual('23:55')
  })

  describe('with a range', () => {
    it('throws an error when one parameter is missing', () => {
      expect(() => addOrSubtractMinutes('00:00', 0, { from: '22:00' })).toThrowError()
      expect(() => addOrSubtractMinutes('00:00', 0, { to: '22:00' })).toThrowError()
    })

    describe('with from < to', () => {
      const range = { from: '08:45', to: '16:00' }
      const narrowRange = { from: '09:30', to: '09:40' }

      it('works properly within the range', () => {
        expect(addOrSubtractMinutes('09:25', 100, range)).toEqual('11:05')
        expect(addOrSubtractMinutes('16:00', -22, range)).toEqual('15:38')
      })

      it('does not exceed the lower boundary', () => {
        expect(addOrSubtractMinutes('09:00', -15, range)).toEqual(range.from)
        expect(addOrSubtractMinutes('09:00', -30, range)).toEqual(range.from)
      })

      it('does not exceed the upper boundary', () => {
        expect(addOrSubtractMinutes('15:30', 30, range)).toEqual(range.to)
        expect(addOrSubtractMinutes('15:45', 150, range)).toEqual(range.to)
      })

      it('works in really narrow ranges', () => {
        expect(addOrSubtractMinutes('09:30', 9, narrowRange)).toEqual('09:39')
        expect(addOrSubtractMinutes('09:31', 50, narrowRange)).toEqual(narrowRange.to)
        expect(addOrSubtractMinutes('09:45', -5, narrowRange)).toEqual('09:40')
        expect(addOrSubtractMinutes('09:45', -52, narrowRange)).toEqual(narrowRange.from)
      })
    })

    describe('with from > to', () => {
      const range = { from: '16:00', to: '08:45' }
      const narrowRange = { from: '23:50', to: '00:05' }

      it('works properly within the range', () => {
        expect(addOrSubtractMinutes('17:00', 100, range)).toEqual('18:40')
        expect(addOrSubtractMinutes('06:30', -30, range)).toEqual('06:00')
      })

      it('does not exceed the lower boundary', () => {
        expect(addOrSubtractMinutes('16:10', -10, range)).toEqual(range.from)
        expect(addOrSubtractMinutes('16:50', -120, range)).toEqual(range.from)
      })

      it('does not exceed the upper boundary', () => {
        expect(addOrSubtractMinutes('08:30', 30, range)).toEqual(range.to)
        expect(addOrSubtractMinutes('06:12', 200, range)).toEqual(range.to)
      })

      it('works in really narrow ranges', () => {
        expect(addOrSubtractMinutes('23:52', 9, narrowRange)).toEqual('00:01')
        expect(addOrSubtractMinutes('23:52', 50, narrowRange)).toEqual(narrowRange.to)
        expect(addOrSubtractMinutes('00:04', -50, narrowRange)).toEqual(narrowRange.from)
      })
    })
  })
})

describe('formatTime', () => {
  it('properly formats a time', () => {
    expect(formatTime({ hours: 10, minutes: 52 })).toEqual('10:52')
  })

  it('adds a leading zero to digits', () => {
    expect(formatTime({ hours: 9, minutes: 5 })).toEqual('09:05')
  })
})

describe('parseTime', () => {
  it('properly parses a time', () => {
    expect(parseTime('21:56')).toEqual({
      hours: 21,
      minutes: 56
    })
  })

  it('falls back to defaults when garbage is parsed', () => {
    expect(parseTime('awfaf:--fa#')).toEqual({
      hours: 0,
      minutes: 0
    })
  })
})
