import { useNavigate } from 'react-router-dom'

import './StoryPage.css'

import MainTitle from '../../components/initial-page-title/MainTitle'
import BackButton from '../../components/back-button/BackButton'
import BottomButton from '../../components/bottom-button/BottomButton'

import smartphoneImage from '../../assets/story-page/image-smartphone.png'

function StoryPage() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/avatarsetting')
  }

  const handleStart = () => {
    navigate('/home')
  }

  return (
    <div className='story-page'>
      <div className='story-page__back-area'>
        <BackButton onClick={handleBack} />
      </div>

      <div className='story-page__scroll-area'>
        <header className='story-page__header'>
          <MainTitle>Filaby를 시작해 볼까요?</MainTitle>
        </header>

        <main className='story-page__content'>
          <section className='story-page__card story-page__camera-card'>
            <h2 className='story-page__card-title'>
              카메라로 촬영해
              <br />
              루틴을 인증할 수 있어요
            </h2>

            <img
              className='story-page__smartphone-image'
              src={smartphoneImage}
              alt='카메라로 루틴을 인증하는 화면'
            />
          </section>

          <section className='story-page__card story-page__episode-card'>
            <h2 className='story-page__card-title'>
              연속으로 루틴을 달성할 때,
              <br />
              새로운 에피소드가 하나씩 열려요
            </h2>

            <p className='story-page__description'>
              {' '}
              평행세계에는 나와 닮은 또 다른 내가 살고 있습니다. 하지만 그곳의 나는 무너진 일상
              속에서 건강도, 자신감도 잃어버린 채 살아가고 있죠. 어느 날 거짓말처럼 두 세계가
              연결되고, 네 명의 필라비 크루와 함께 실천하는 작은 루틴들이 평행세계 속 나에게 기적
              같은 변화를 일으키기 시작합니다.
            </p>
          </section>
        </main>
      </div>

      <footer className='story-page__footer'>
        <div className='story-page__bottom-bar' aria-hidden='true'>
          <span />
          <span />
          <span />
          <span className='story-page__bottom-dot--active' />
        </div>

        <BottomButton onClick={handleStart}>Filaby 시작하기</BottomButton>
      </footer>
    </div>
  )
}

export default StoryPage
