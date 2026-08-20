export const TIMELINE_START_MINUTES = 6 * 60
export const TIMELINE_END_MINUTES = 24 * 60

export const ROUTINE_CARD_HEIGHT = 64
export const ROUTINE_CARD_GAP = 10

const TIMELINE_TOP_PADDING = 42
const TIMELINE_BOTTOM_PADDING = 42

// 1시간당 12px
const PIXELS_PER_MINUTE = 0.2

// 루틴 한 개가 추가될 때 늘어나는 높이
const ROUTINE_ROW_HEIGHT = ROUTINE_CARD_HEIGHT + ROUTINE_CARD_GAP

export function parseTimeToMinutes(time) {
  if (typeof time !== 'string') {
    return TIMELINE_START_MINUTES
  }

  const [hourText, minuteText] = time.split(':')
  const hour = Number(hourText)
  const minute = Number(minuteText)

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return TIMELINE_START_MINUTES
  }

  return Math.max(TIMELINE_START_MINUTES, Math.min(hour * 60 + minute, TIMELINE_END_MINUTES))
}

export function createRoutineTimelineLayout(routines = []) {
  const sortedRoutines = routines
    .map((routine, originalIndex) => ({
      routine,
      originalIndex,
      minutes: parseTimeToMinutes(routine.startTime),
    }))
    .sort((first, second) => {
      return first.minutes - second.minutes || first.originalIndex - second.originalIndex
    })

  const getYForMinutes = (minutes) => {
    const safeMinutes = Math.max(TIMELINE_START_MINUTES, Math.min(minutes, TIMELINE_END_MINUTES))

    const previousRoutineCount = sortedRoutines.filter((item) => item.minutes < safeMinutes).length

    return (
      TIMELINE_TOP_PADDING +
      (safeMinutes - TIMELINE_START_MINUTES) * PIXELS_PER_MINUTE +
      previousRoutineCount * ROUTINE_ROW_HEIGHT
    )
  }

  const positionedRoutines = sortedRoutines.map((item, index) => ({
    routine: item.routine,
    top:
      TIMELINE_TOP_PADDING +
      (item.minutes - TIMELINE_START_MINUTES) * PIXELS_PER_MINUTE +
      index * ROUTINE_ROW_HEIGHT -
      ROUTINE_CARD_HEIGHT / 2,
  }))

  const endY = getYForMinutes(TIMELINE_END_MINUTES)

  return {
    height: endY + TIMELINE_BOTTOM_PADDING,
    startY: getYForMinutes(TIMELINE_START_MINUTES),
    endY,
    positionedRoutines,
    getYForMinutes,
  }
}
