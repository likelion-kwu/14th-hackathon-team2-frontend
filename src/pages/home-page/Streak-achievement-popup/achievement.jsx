import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import './achievement.css'

const DEFAULT_DAYS = ['수', '목', '금', '토', '일', '월', '화']

function Achievement({ data, streak, completedDays, days, onOpenChange }) {
  const [isOpen, setIsOpen] = useState(false)

  const resolvedStreak = streak ?? data?.streak ?? 2
  const resolvedDays = days ?? data?.days ?? DEFAULT_DAYS

  const resolvedCompletedDays = Math.min(
    resolvedDays.length,
    Math.max(0, completedDays ?? data?.completedDays ?? 2),
  )

  const openAchievement = (event) => {
    event.stopPropagation()

    setIsOpen(true)
    onOpenChange?.(true)
  }

  const closeAchievement = (event) => {
    event?.stopPropagation()

    setIsOpen(false)
    onOpenChange?.(false)
  }

  useEffect(() => {
    if (!isOpen) return undefined

    const previousOverflow = document.body.style.overflow

    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return

      setIsOpen(false)
      onOpenChange?.(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onOpenChange])

  const progressWidth =
    resolvedCompletedDays > 0 ? resolvedCompletedDays * 34 + (resolvedCompletedDays - 1) * 7 : 0

  return (
    <>
      <button
        type='button'
        className='achievement__trigger'
        aria-label='연속 루틴 달성 기록 보기'
        aria-expanded={isOpen}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={openAchievement}
      >
        <svg width='26' height='26' viewBox='0 0 26 26' fill='none' aria-hidden='true'>
          <circle cx='8' cy='8' r='4' stroke='currentColor' strokeWidth='1.8' />

          <path
            d='M5.8 8.1 7.2 9.5 10.4 6.2'
            stroke='currentColor'
            strokeWidth='1.8'
            strokeLinecap='round'
            strokeLinejoin='round'
          />

          <circle cx='18' cy='8' r='4' stroke='currentColor' strokeWidth='1.8' />

          <circle cx='8' cy='18' r='4' stroke='currentColor' strokeWidth='1.8' />

          <circle cx='18' cy='18' r='4' stroke='currentColor' strokeWidth='1.8' />
        </svg>
      </button>

      {isOpen &&
        createPortal(
          <div
            className='achievement__overlay'
            role='presentation'
            onPointerDown={(event) => event.stopPropagation()}
            onClick={closeAchievement}
          >
            <section
              className='achievement__popup'
              role='dialog'
              aria-modal='true'
              aria-label={`${resolvedStreak}일 연속 루틴 달성`}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
            >
              <div className='achievement__handle' />

              <div className='achievement__confetti' aria-hidden='true'>
                {Array.from({ length: 16 }, (_, index) => (
                  <span
                    key={index}
                    className={`achievement__confetti-piece achievement__confetti-piece--${
                      index + 1
                    }`}
                  />
                ))}
              </div>

              <div className='achievement__streak'>
                <span>{resolvedStreak}</span>
              </div>

              <div className='achievement__calendar'>
                {resolvedCompletedDays > 0 && (
                  <div
                    className='achievement__progress-background'
                    style={{ width: `${progressWidth}px` }}
                  />
                )}

                {resolvedDays.map((day, index) => {
                  const isCompleted = index < resolvedCompletedDays
                  const isLatest = index === resolvedCompletedDays - 1

                  const circleClassName = [
                    'achievement__day-circle',
                    isCompleted ? 'achievement__day-circle--completed' : '',
                    isLatest ? 'achievement__day-circle--latest' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')

                  const labelClassName = [
                    'achievement__day-label',
                    isLatest ? 'achievement__day-label--latest' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')

                  return (
                    <div className='achievement__day' key={`${day}-${index}`}>
                      <div className={circleClassName}>
                        {isCompleted && (
                          <svg
                            width='18'
                            height='18'
                            viewBox='0 0 18 18'
                            fill='none'
                            aria-hidden='true'
                          >
                            <path
                              d='m4 9 3.1 3L14 5.5'
                              stroke='currentColor'
                              strokeWidth='2.4'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                        )}
                      </div>

                      <span className={labelClassName}>{day}</span>
                    </div>
                  )
                })}
              </div>

              <button type='button' className='achievement__message' onClick={closeAchievement}>
                {resolvedStreak}일 연속으로 루틴을 달성했어요!
              </button>
            </section>
          </div>,
          document.body,
        )}
    </>
  )
}

export default Achievement
