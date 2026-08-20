import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

import { getRecords } from '../../../api/recordApi'

import './achievement.css'

const KOREAN_WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

function formatDate(date) {
  const year = date.getUTCFullYear()

  const month = String(date.getUTCMonth() + 1).padStart(2, '0')

  const day = String(date.getUTCDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function createRecentSevenDays() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())

  const year = Number(parts.find((part) => part.type === 'year')?.value)

  const month = Number(parts.find((part) => part.type === 'month')?.value)

  const day = Number(parts.find((part) => part.type === 'day')?.value)

  const today = new Date(Date.UTC(year, month - 1, day))

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today)

    date.setUTCDate(today.getUTCDate() - 6 + index)

    return {
      serviceDate: formatDate(date),
      label: KOREAN_WEEKDAYS[date.getUTCDay()],
    }
  })
}

function Achievement({ data, onOpenChange }) {
  const [isOpen, setIsOpen] = useState(false)

  const [recordData, setRecordData] = useState(null)

  const [isLoading, setIsLoading] = useState(false)

  const [errorMessage, setErrorMessage] = useState('')

  const [reloadKey, setReloadKey] = useState(0)

  const recentDays = useMemo(() => {
    return createRecentSevenDays()
  }, [isOpen, reloadKey])

  const fromDate = recentDays[0].serviceDate

  const toDate = recentDays[recentDays.length - 1].serviceDate

  useEffect(() => {
    if (!isOpen) return undefined

    let isActive = true

    const loadRecords = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const response = await getRecords({
          fromDate,
          toDate,
        })

        if (!isActive) return

        setRecordData(response)
      } catch (error) {
        if (!isActive) return

        console.error('달성 기록을 불러오지 못했습니다.', error)

        setErrorMessage(error.message ?? '달성 기록을 불러오지 못했습니다.')
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadRecords()

    return () => {
      isActive = false
    }
  }, [isOpen, fromDate, toDate, reloadKey])

  const calendarDays = useMemo(() => {
    const recordMap = new Map(
      (recordData?.days ?? []).map((record) => [record.serviceDate, record]),
    )

    return recentDays.map((day) => {
      const record = recordMap.get(day.serviceDate)

      return {
        ...day,
        record,
        isCompleted: record?.dayStatus === 'SUCCESS',
      }
    })
  }, [recentDays, recordData])

  const latestCompletedIndex = calendarDays.reduce((latestIndex, day, index) => {
    return day.isCompleted ? index : latestIndex
  }, -1)

  const resolvedStreak = recordData?.summary?.currentStreakDays ?? data?.streak ?? 0

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

  const handleRetry = (event) => {
    event.stopPropagation()

    setReloadKey((previous) => previous + 1)
  }

  useEffect(() => {
    if (!isOpen) return undefined

    const previousOverflow = document.body.style.overflow

    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') {
        return
      }

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

              {isLoading && <div className='achievement__status'>기록을 불러오고 있어요</div>}

              {!isLoading && errorMessage && (
                <div className='achievement__status'>
                  <span>기록을 불러오지 못했어요</span>

                  <button type='button' className='achievement__retry' onClick={handleRetry}>
                    다시 불러오기
                  </button>
                </div>
              )}

              <div className='achievement__calendar'>
                {calendarDays.map((day, index) => {
                  const isLatest = index === latestCompletedIndex

                  const isConnected = day.isCompleted && calendarDays[index + 1]?.isCompleted

                  const circleClassName = [
                    'achievement__day-circle',
                    day.isCompleted ? 'achievement__day-circle--completed' : '',
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
                    <div className='achievement__day' key={day.serviceDate}>
                      {isConnected && <span className='achievement__day-connector' />}

                      <div className={circleClassName}>
                        {day.isCompleted && (
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

                      <span className={labelClassName}>{day.label}</span>
                    </div>
                  )
                })}
              </div>

              <button type='button' className='achievement__message' onClick={closeAchievement}>
                {resolvedStreak > 0
                  ? `${resolvedStreak}일 연속으로 루틴을 달성했어요!`
                  : '오늘부터 연속 달성을 시작해 볼까요?'}
              </button>
            </section>
          </div>,
          document.body,
        )}
    </>
  )
}

export default Achievement
