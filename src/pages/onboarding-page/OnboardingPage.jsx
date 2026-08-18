import onboardingBackground from '../../assets/onboarding-page/image-background.svg'
import onboardingCharacters from '../../assets/onboarding-page/image-character.svg'
import onboardingStar from '../../assets/onboarding-page/image-star.svg'

function OnboardingPage() {
  return (
    <main className='onboarding-page'>
      <div className='onboarding-page__visual'>
        <img className='onboarding-page__background' src={onboardingBackground} alt='' />

        <img
          className='onboarding-page__characters'
          src={onboardingCharacters}
          alt='온보딩 캐릭터'
        />

        <img className='onboarding-page__star' src={onboardingStar} alt='' />
      </div>

      <section className='onboarding-page__text'>
        <h1 className='onboarding-page__title'>Let's Fill Your Ability!</h1>

        <p className='onboarding-page__description'>또 다른 나와 함께 채워가는 매일의 가능성</p>
      </section>
    </main>
  )
}

export default OnboardingPage
