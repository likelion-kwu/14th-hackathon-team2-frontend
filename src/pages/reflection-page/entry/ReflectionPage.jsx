import { useEffect, useMemo, useState } from 'react'

import { getHome } from '../../../api/homeApi'
import { getRecords } from '../../../api/recordApi'
import { Icon } from '../../../components/icon/Icon'

import './ReflectionPage.css'

const GIFT_ICONS = ['giftbox-green', 'giftbox-blue', 'giftbox-pink']

function formatDate(year, month, day) {
  return [year, String(month + 1).padStart(2, '0'), String(day).padStart(2, '0')].join('-')
}

function createDateOnly(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function getStatusIcon(record, date, today) {
  const targetDate = createDateOnly(date)
  const currentDate = createDateOnly(today)

  if (!record || targetDate > currentDate || record.totalCount <= 0) {
    return null
  }

  if (record.completedCount >= record.totalCount) {
    return 'check-icon'
  }

  if (record.completedCount > 0) {
    return 'normal-icon'
  }

  if (targetDate < currentDate || record.dayStatus === 'FAILED') {
    return 'fail-icon'
  }

  return null
}

function ReflectionPage() {
  const today = useMemo(() => new Date(), [])

  const [currentDate, setCurrentDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  )

  const [recordData, setRecordData] = useState({
    days: [],
  })

  const [isLoading, setIsLoading] = useState(false)
  const [recordError, setRecordError] = useState('')

  const [totalEarnedPoints, setTotalEarnedPoints] = useState(0)

  const [nextItemMilestonePoints, setNextItemMilestonePoints] = useState(100)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()

  const lastDate = new Date(year, month + 1, 0).getDate()

  const days = Array.from({ length: lastDate }, (_, index) => index + 1)

  const recordsByDay = useMemo(() => {
    return new Map(
      (recordData.days ?? []).map((record) => [Number(record.serviceDate.slice(-2)), record]),
    )
  }, [recordData.days])

  const achievedDays = useMemo(() => {
    return (recordData.days ?? []).filter((record) => record.dayStatus === 'SUCCESS').length
  }, [recordData.days])

  const itemMilestones = useMemo(() => {
    const firstMilestone = Math.max(100, nextItemMilestonePoints)

    return [firstMilestone, firstMilestone + 100, firstMilestone + 200]
  }, [nextItemMilestonePoints])

  useEffect(() => {
    let isCancelled = false

    const loadRecords = async () => {
      setIsLoading(true)
      setRecordError('')

      try {
        const result = await getRecords({
          fromDate: formatDate(year, month, 1),
          toDate: formatDate(year, month, lastDate),
        })

        if (isCancelled) return

        setRecordData({
          days: result?.days ?? [],
        })
      } catch (error) {
        console.error('월간 기록을 불러오지 못했습니다.', error)

        if (isCancelled) return

        setRecordData({
          days: [],
        })

        setRecordError(error.message ?? '월간 기록을 불러오지 못했습니다.')
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadRecords()

    return () => {
      isCancelled = true
    }
  }, [lastDate, month, year])

  useEffect(() => {
    let isCancelled = false

    const loadUnlockProgress = async () => {
      try {
        const home = await getHome()

        if (isCancelled) return

        const totalEarned = home?.points?.totalEarned ?? 0

        const calculatedNextMilestone = (Math.floor(totalEarned / 100) + 1) * 100

        setTotalEarnedPoints(totalEarned)

        setNextItemMilestonePoints(
          home?.unlockProgress?.nextItemMilestonePoints ?? calculatedNextMilestone,
        )
      } catch (error) {
        console.error('아이템 해금 진행도를 불러오지 못했습니다.', error)
      }
    }

    loadUnlockProgress()

    return () => {
      isCancelled = true
    }
  }, [])

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  return (
    <div className='reflection__container'>
      <h1 className='reflection__title'>성찰하기</h1>

      <section className='reflection__battlepass'>
        <div className='reflection__battlepass__header'>
          <h2 className='reflection__battlepass__title'>곧 얻을 수 있어요</h2>

          <span className='reflection__battlepass__point'>현재 {totalEarnedPoints}P</span>
        </div>

        <div className='reflection__battlepass__content'>
          <div className='reflection__battlepass__content__boxes'>
            {GIFT_ICONS.map((iconName) => (
              <div key={iconName} className='reflection__battlepass__content__boxes__box'>
                <Icon name={iconName} width={110} height={110} />
              </div>
            ))}
          </div>

          <Icon name='gift-bar' width={362} className='reflection__battlepass__content__bar' />

          <div className='reflection__battlepass__content__text'>
            {itemMilestones.map((milestone) => (
              <div key={milestone} className='reflection__battlepass__content__text--box'>
                <div className='reflection__battlepass__content__text--title'>아이템</div>

                <div className='reflection__battlepass__content__text--point'>{milestone}P</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='reflection__calendar'>
        <p className='reflection__calendar__title'>
          {month + 1}월 한 달 동안
          <br />
          <span className='reflection__calendar__title--highlight'>{achievedDays}일</span>
          이나 달성했어요!
        </p>

        <div className='reflection__calendar__calendar'>
          <div className='reflection__calendar__calendar__header'>
            <button
              type='button'
              className='reflection__calendar__calendar__arrow'
              aria-label='이전 달 보기'
              onClick={handlePrevMonth}
            >
              <Icon name='arrow-left' width={10} height={9} />
            </button>

            <div className='reflection__calendar__calendar__month'>
              {year}년 {month + 1}월
            </div>

            <button
              type='button'
              className='reflection__calendar__calendar__arrow'
              aria-label='다음 달 보기'
              onClick={handleNextMonth}
            >
              <Icon name='arrow-right' width={10} height={9} />
            </button>
          </div>

          <div className='reflection__calendar__calendar__week' aria-hidden='true'>
            <div>일</div>
            <div>월</div>
            <div>화</div>
            <div>수</div>
            <div>목</div>
            <div>금</div>
            <div>토</div>
          </div>

          {recordError && <p className='reflection__calendar__error'>{recordError}</p>}

          <div
            className={`reflection__calendar__calendar__days ${
              isLoading ? 'reflection__calendar__calendar__days--loading' : ''
            }`}
            aria-busy={isLoading}
          >
            {Array.from({ length: firstDay }, (_, index) => (
              <div key={`empty-${index}`} className='reflection__calendar__calendar__day empty' />
            ))}

            {days.map((day) => {
              const record = recordsByDay.get(day)

              const statusIcon = getStatusIcon(record, new Date(year, month, day), today)

              return (
                <div key={day} className='reflection__calendar__calendar__day'>
                  <span>{day}</span>

                  <div className='reflection__calendar__calendar__status'>
                    {statusIcon && <Icon name={statusIcon} width={50} height={50} />}
                  </div>
                </div>
              )
            })}
          </div>

          {isLoading && <p className='reflection__calendar__loading'>기록을 불러오는 중...</p>}
        </div>
      </section>
    </div>
  )
}

export default ReflectionPage
