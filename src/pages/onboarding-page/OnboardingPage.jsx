import './OnboardingPage.css'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ensureGuestSession } from '../../api/sessionApi'

import BottomButton from '../../components/bottom-button/BottomButton'

import onboardingCharacters from '../../assets/onboarding-page/image-character.svg'
import onboardingBar from '../../assets/onboarding-page/image-bottombar.svg'

const NEXT_STEP_ROUTE = {
  NICKNAME_SETUP: '/inputinfor',
  AVATAR_SETUP: '/tracksetting',
  SPEECH_STYLE_SETUP: '/avatarsetting',
  HOME: '/home',
}

function OnboardingPage() {
  const navigate = useNavigate()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNext = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      const session = await ensureGuestSession()

      const nextRoute = NEXT_STEP_ROUTE[session.nextStep] ?? '/inputinfor'

      navigate(nextRoute)
    } catch (error) {
      console.error(error)

      alert(error.message ?? '사용자 정보를 생성하지 못했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='onboarding-page'>
      <div className='onboarding-page__visual'>
        <img
          className='onboarding-page__characters'
          src={onboardingCharacters}
          alt='온보딩 캐릭터'
        />
      </div>

      <section className='onboarding-page__text'>
        <h1 className='onboarding-page__title'>Let's Fill Your Ability!</h1>

        <p className='onboarding-page__description'>또 다른 나와 함께 채워가는 매일의 가능성</p>
      </section>

      <img className='onboarding-page__bottom-bar' src={onboardingBar} alt='' />

      <BottomButton onClick={handleNext} disabled={isSubmitting}>
        {isSubmitting ? '서버 연결 중...' : 'Filaby 시작하기'}
      </BottomButton>
    </div>
  )
}

export default OnboardingPage
