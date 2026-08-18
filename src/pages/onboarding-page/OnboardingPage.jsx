import './OnboardingPage.css'
import BottomButton from '../../components/bottom-button/BottomButton'
import onboardingCharacters from '../../assets/onboarding-page/image-character.svg'
import onboardingBar from '../../assets/onboarding-page/image-bottombar.svg'

function OnboardingPage() {
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

      <BottomButton>Filaby 시작하기</BottomButton>
    </div>
  )
}

export default OnboardingPage
