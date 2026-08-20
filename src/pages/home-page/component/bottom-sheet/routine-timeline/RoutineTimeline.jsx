import { useEffect, useState } from 'react'

import { TIMELINE_END_MINUTES, TIMELINE_START_MINUTES } from '../routineTimelineLayout'

import './RoutineTimeline.css'

const TIME_LABELS = [6 * 60, 12 * 60, 15 * 60, 18 * 60, 21 * 60, 24 * 60]

function getKoreaMinutes() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())

  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? 0)

  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? 0)

  return hour * 60 + minute
}

function formatTime(minutes) {
  const hour = Math.floor(minutes / 60)
  const minute = minutes % 60

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

function RoutineTimeline({ sunImage, moonImage, layout }) {
  const [currentMinutes, setCurrentMinutes] = useState(getKoreaMinutes)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentMinutes(getKoreaMinutes())
    }, 60 * 1000)

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  const isNowVisible =
    currentMinutes >= TIMELINE_START_MINUTES && currentMinutes <= TIMELINE_END_MINUTES

  const nowY = layout.getYForMinutes(currentMinutes)

  const pastTrackHeight = Math.max(0, Math.min(nowY, layout.endY) - layout.startY)

  const futureTrackTop = layout.startY + pastTrackHeight

  return (
    <div
      className='routineTimeline'
      style={{
        height: `${layout.height}px`,
      }}
    >
      <div
        className='routineTimeline__track routineTimeline__track--past'
        style={{
          top: `${layout.startY}px`,
          height: `${pastTrackHeight}px`,
        }}
      />

      <div
        className='routineTimeline__track routineTimeline__track--future'
        style={{
          top: `${futureTrackTop}px`,
          height: `${layout.endY - futureTrackTop}px`,
        }}
      />

      {TIME_LABELS.map((minutes) => {
        const isStart = minutes === TIMELINE_START_MINUTES

        const isEnd = minutes === TIMELINE_END_MINUTES

        return (
          <div
            key={minutes}
            className='routineTimeline__marker'
            style={{
              top: `${layout.getYForMinutes(minutes)}px`,
            }}
          >
            {isStart && <img src={sunImage} alt='' className='routineTimeline__sun' />}

            {isEnd && <img src={moonImage} alt='' className='routineTimeline__moon' />}

            <span className='routineTimeline__time'>{formatTime(minutes)}</span>
          </div>
        )
      })}

      {isNowVisible && (
        <span
          className='routineTimeline__now'
          style={{
            top: `${nowY}px`,
          }}
        >
          Now
        </span>
      )}
    </div>
  )
}

export default RoutineTimeline
