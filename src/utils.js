const MINUTES_PER_DAY = 24 * 60

const inRange = (from, to, totalMinutes) => {
  const normalizedMinutes = normalizeTotalMinutes(totalMinutes)

  if (from < to) return normalizedMinutes >= from && normalizedMinutes <= to
  if (from > to) return normalizedMinutes >= from || normalizedMinutes <= to
  return from === to === normalizedMinutes
}

const normalizeHours = hours => {
  if (hours < 0) return 0
  if (hours > 23) return 23
  return hours
}

const normalizeMinutes = minutes => {
  if (minutes < 0) return 0
  if (minutes > 59) return 59
  return minutes
}

const normalizeTotalMinutes = totalMinutes => (
  totalMinutes < 0
    ? MINUTES_PER_DAY + (totalMinutes % MINUTES_PER_DAY)
    : totalMinutes % MINUTES_PER_DAY
)

export const formatNumber = number => {
  const parsedNumber = Math.abs(parseInt(number) || 0)

  return parsedNumber > 9 ? String(parsedNumber) : `0${String(parsedNumber)}`
}

export const formatTime = ({ hours, minutes }) => (
  `${formatNumber(hours)}:${formatNumber(minutes)}`
)

export const parseTime = time => {
  const [hours, minutes] = time.split(':')

  return {
    hours: normalizeHours(parseInt(hours) || 0),
    minutes: normalizeMinutes(parseInt(minutes) || 0)
  }
}

const minutesToHoursAndMinutes = minutes => {
  const normalizedMinutes = normalizeTotalMinutes(minutes)
  const hours = Math.floor(normalizedMinutes / 60)

  return {
    hours,
    minutes: normalizedMinutes - hours * 60
  }
}

const hoursAndMinutesToMinutes = (hours, minutes) => 60 * hours + minutes

const totalMinutesFromRange = (from, to) => {
  const fromTime = parseTime(from)
  const fromMinutes = hoursAndMinutesToMinutes(fromTime.hours, fromTime.minutes)
  const toTime = parseTime(to)
  const toMinutes = hoursAndMinutesToMinutes(toTime.hours, toTime.minutes)
  const rangeInMinutes = fromMinutes <= toMinutes
    ? toMinutes - fromMinutes
    : MINUTES_PER_DAY - fromMinutes + toMinutes

  return {
    fromMinutes,
    rangeInMinutes,
    toMinutes
  }
}

const addOrSubtractMinutesWithRange = (value, delta, from, to) => {
  const { fromMinutes, rangeInMinutes, toMinutes } = totalMinutesFromRange(from, to)
  const { hours, minutes } = parseTime(value)
  const nextMinutes = hoursAndMinutesToMinutes(hours, minutes) + delta

  if (rangeInMinutes === 0) {
    return minutesToHoursAndMinutes(fromMinutes)
  } else if (inRange(fromMinutes, toMinutes, nextMinutes)) {
    return minutesToHoursAndMinutes(nextMinutes)
  } else {
    return delta > 0
      ? minutesToHoursAndMinutes(toMinutes)
      : minutesToHoursAndMinutes(fromMinutes)
  }
}

export const addOrSubtractMinutes = (value, delta, options = {}) => {
  const { from, to } = options

  if (from && !to) throw new Error('`from` range parameter is specified while `to` is missing.')
  if (!from && to) throw new Error('`to` range parameter is specified while `from` is missing.')

  if (from && to) {
    return formatTime(addOrSubtractMinutesWithRange(value, delta, from, to))
  }

  const { hours, minutes } = parseTime(value)
  const nextMinutes = hoursAndMinutesToMinutes(hours, minutes) + delta

  return formatTime(minutesToHoursAndMinutes(nextMinutes))
}
