import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './IntroPage.css'

import BackButton from '../../components/back-button/BackButton'
import BottomButton from '../../components/bottom-button/BottomButton'

import intro1 from '../../assets/story/intro/intro-1.png'
import intro2 from '../../assets/story/intro/intro-2.png'
import intro3 from '../../assets/story/intro/intro-3.png'
import intro4 from '../../assets/story/intro/intro-4.png'

const storyImages = [intro1, intro2, intro3, intro4]

function IntroPage() {
  const navigate = useNavigate()

  const [currentIndex, setCurrentIndex] = useState(0)

  const isLastImage = currentIndex === storyImages.length - 1

  const handleBack = () => {
    navigate('/avatarsetting')
  }

  const handleNext = () => {
    navigate('/story')
  }

  const moveToNextImage = () => {
    if (isLastImage) return

    setCurrentIndex((prev) => prev + 1)
  }

  const handleStoryClick = () => {
    moveToNextImage()
  }

  useEffect(() => {
    if (isLastImage) return undefined

    const timer = setTimeout(() => {
      moveToNextImage()
    }, 3000)

    return () => {
      clearTimeout(timer)
    }
  }, [currentIndex, isLastImage])

  return (
    <div className='intro-page'>
      <div className='intro-page__back-area'>
        <BackButton onClick={handleBack} />
      </div>

      <main className='intro-page__content' onClick={handleStoryClick}>
        {storyImages.map((image, index) => (
          <img
            key={image}
            src={image}
            alt={`인트로 스토리 ${index + 1}`}
            className={`intro-page__story-image ${index === currentIndex ? 'active' : ''} ${
              index === 1 && currentIndex === 1 ? 'impact' : ''
            }`}
            draggable={false}
          />
        ))}
      </main>

      <footer className={`intro-page__footer ${isLastImage ? 'active' : ''}`}>
        {isLastImage && <BottomButton onClick={handleNext}>다음</BottomButton>}
      </footer>
    </div>
  )
}

export default IntroPage
