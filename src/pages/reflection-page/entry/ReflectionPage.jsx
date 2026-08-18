import { useState } from 'react'
import './ReflectionPage.css'
import { Icon } from '../../../components/icon/Icon'

function ReflectionPage() {
  const today = new Date()

  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()

  const days = Array.from({ length: lastDate }, (_, index) => index + 1)

  // 예시 데이터
  // 실제 API 연결 시 날짜별 RoutineStatus를 받아오면 됨
  const routineStatusByDay = {
    1: 'success',
    2: 'success',
    3: 'normal',
    4: 'fail',
    5: 'fail',
    6: null,
    7: 'success',
  }

  const getRoutineStatusIcon = (status) => {
    switch (status) {
      case 'normal':
        return 'normal-icon'
      case 'fail':
        return 'fail-icon'
      case 'success':
        return 'check-icon'
      default:
        return 'none-icon'
    }
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  return (
    <div className='reflection__container'>
      <div className='reflection__title'>성찰하기</div>

      <section className='reflection__battlepass'>
        <div className='reflection__battlepass__title'>곧 얻을 수 있어요</div>

        <section className='reflection__battlepass__content'>
          <div className='reflection__battlepass__content__boxes'>
            <div className='reflection__battlepass__content__boxes__box '>
              <Icon name='giftbox-green' width={110} height={110} />
            </div>

            <div className='reflection__battlepass__content__boxes__box '>
              <Icon name='giftbox-blue' width={110} height={110} />
            </div>

            <div className='reflection__battlepass__content__boxes__box '>
              <Icon name='giftbox-pink' width={110} height={110} />
            </div>
          </div>

          <Icon name='gift-bar' width={362} className='reflection__battlepass__content__bar' />

          <div className='reflection__battlepass__content__text'>
            <div className='reflection__battlepass__content__text--box'>
              <div className='reflection__battlepass__content__text--title'>상의</div>
              <div className='reflection__battlepass__content__text--point'>100P</div>
            </div>

            <div className='reflection__battlepass__content__text--box'>
              <div className='reflection__battlepass__content__text--title'>하의</div>
              <div className='reflection__battlepass__content__text--point'>100P</div>
            </div>

            <div className='reflection__battlepass__content__text--box'>
              <div className='reflection__battlepass__content__text--title'>상의</div>
              <div className='reflection__battlepass__content__text--point'>100P</div>
            </div>
          </div>
        </section>
      </section>

      <section className='reflection__calendar'>
        <p className='reflection__calendar__title'>
          {month + 1}월 한 달 동안
          <br />
          <span className='reflection__calendar__title--highlight'>8일</span>이나 달성했어요!
        </p>

        <div className='reflection__calendar__calendar'>
          <div className='reflection__calendar__calendar__header'>
            <Icon
              name='arrow-left'
              width={10}
              height={9}
              className='reflection__calendar__calendar__arrow'
              onClick={handlePrevMonth}
            />

            <div className='reflection__calendar__calendar__month'>{month + 1}월</div>

            <Icon
              name='arrow-right'
              width={10}
              height={9}
              className='reflection__calendar__calendar__arrow'
              onClick={handleNextMonth}
            />
          </div>

          <div className='reflection__calendar__calendar__week'>
            <div>일</div>
            <div>월</div>
            <div>화</div>
            <div>수</div>
            <div>목</div>
            <div>금</div>
            <div>토</div>
          </div>

          <div className='reflection__calendar__calendar__days'>
            {Array.from({ length: firstDay }, (_, index) => (
              <div key={`empty-${index}`} className='reflection__calendar__calendar__day empty' />
            ))}

            {days.map((day) => {
              const RoutineStatus = routineStatusByDay[day]

              return (
                <div key={day} className='reflection__calendar__calendar__day'>
                  <span>{day}</span>

                  <div className='reflection__calendar__calendar__status'>
                    <Icon name={getRoutineStatusIcon(RoutineStatus)} width={50} height={50} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ReflectionPage
