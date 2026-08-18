import './ReflectionPage.css'

function ReflectionPage() {
  return (
    <div className='reflection__container'>
      <div className='reflection__title'>성찰하기</div>
      <section className='reflection__battlepass'>
        <div className='reflection__battlepass__title'>곧 얻을 수 있어요</div>
        <section className='reflection__battlepass__content'>
          <div className='reflection__battlepass__content__boxes'>
            <div className='reflection__battlepass__content__boxes__box'>상자1</div>
            <div className='reflection__battlepass__content__boxes__box'>상자2</div>
            <div className='reflection__battlepass__content__boxes__box'>상자3</div>
          </div>
          <div className='reflection__battlepass__content__bar'></div>
          <div className='reflection__battlepass__content__text'>
            <div className='reflection__battlepass__content__text--box'>
              <div className='reflection__battlepass__content__text--title'>상의</div>
              <div className='reflection__battlepass__content__text--point'>100P</div>
            </div>
            <div className='reflection__battlepass__content__text--box'>
              <div className='reflection__battlepass__content__text--title'>상의</div>
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
          9월 한 달 동안
          <br />
          <span className='reflection__calendar__title--highlight'>8일</span>이나 달성했어요!
        </p>
        <div className='reflection__calendar__calendar'>캘린더</div>
      </section>
    </div>
  )
}

export default ReflectionPage
