import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import './EpisodePage.css'

import BackButton from '../../components/back-button/BackButton'
import BottomButton from '../../components/bottom-button/BottomButton'

import episode1Image1 from '../../assets/story/ep1/ep1-1.png'
import episode1Image2 from '../../assets/story/ep1/ep1-2.png'
import episode1Image3 from '../../assets/story/ep1/ep1-3.png'
import episode1Image4 from '../../assets/story/ep1/ep1-4.png'

import episode2Image1 from '../../assets/story/ep2/ep2-1.png'
import episode2Image2 from '../../assets/story/ep2/ep2-2.png'
import episode2Image3 from '../../assets/story/ep2/ep2-3.png'
import episode2Image4 from '../../assets/story/ep2/ep2-4.png'
import episode2Image5 from '../../assets/story/ep2/ep2-5.png'

import episode3Image1 from '../../assets/story/ep3/ep3-1.png'
import episode3Image2 from '../../assets/story/ep3/ep3-2.png'
import episode3Image3 from '../../assets/story/ep3/ep3-3.png'
import episode3Image4 from '../../assets/story/ep3/ep3-4.png'
import episode3Image5 from '../../assets/story/ep3/ep3-5.png'

import episode4Image1 from '../../assets/story/ep4/ep4-1.png'
import episode4Image2 from '../../assets/story/ep4/ep4-2.png'
import episode4Image3 from '../../assets/story/ep4/ep4-3.png'
import episode4Image4 from '../../assets/story/ep4/ep4-4.png'
import episode4Image5 from '../../assets/story/ep4/ep4-5.png'
import episode4Image6 from '../../assets/story/ep4/ep4-6.png'
import episode4Image7 from '../../assets/story/ep4/ep4-7.png'
import episode4Image8 from '../../assets/story/ep4/ep4-8.png'

import episode5Image1 from '../../assets/story/ep5/ep5-1.png'
import episode5Image2 from '../../assets/story/ep5/ep5-2.png'
import episode5Image3 from '../../assets/story/ep5/ep5-3.png'
import episode5Image4 from '../../assets/story/ep5/ep5-4.png'
import episode5Image5 from '../../assets/story/ep5/ep5-5.png'
import episode5Image6 from '../../assets/story/ep5/ep5-6.png'
import episode5Image7 from '../../assets/story/ep5/ep5-7.png'

const STORY_DURATION = 3000

const EPISODE_IMAGES = {
  1: [episode1Image1, episode1Image2, episode1Image3, episode1Image4],
  2: [episode2Image1, episode2Image2, episode2Image3, episode2Image4, episode2Image5],
  3: [episode3Image1, episode3Image2, episode3Image3, episode3Image4, episode3Image5],
  4: [
    episode4Image1,
    episode4Image2,
    episode4Image3,
    episode4Image4,
    episode4Image5,
    episode4Image6,
    episode4Image7,
    episode4Image8,
  ],
  5: [
    episode5Image1,
    episode5Image2,
    episode5Image3,
    episode5Image4,
    episode5Image5,
    episode5Image6,
    episode5Image7,
  ],
}

function EpisodePage() {
  const navigate = useNavigate()
  const location = useLocation()

  const searchParams = new URLSearchParams(location.search)
  const episodeNumber = Number(searchParams.get('episode')) || 1

  const storyImages = EPISODE_IMAGES[episodeNumber] ?? []

  const [storyState, setStoryState] = useState(() => ({
    episodeNumber,
    currentIndex: 0,
  }))

  const isSameEpisode = storyState.episodeNumber === episodeNumber

  const currentIndex = isSameEpisode ? storyState.currentIndex : 0

  const isLastImage = storyImages.length > 0 && currentIndex === storyImages.length - 1

  const handleBack = () => {
    navigate(-1)
  }

  const handleNext = () => {
    navigate('/home')
  }

  const moveToNextImage = () => {
    if (storyImages.length === 0 || isLastImage) return

    setStoryState({
      episodeNumber,
      currentIndex: currentIndex + 1,
    })
  }

  const handleStoryClick = () => {
    moveToNextImage()
  }

  useEffect(() => {
    if (storyImages.length === 0 || isLastImage) {
      return undefined
    }

    const timer = setTimeout(() => {
      setStoryState({
        episodeNumber,
        currentIndex: currentIndex + 1,
      })
    }, STORY_DURATION)

    return () => {
      clearTimeout(timer)
    }
  }, [currentIndex, episodeNumber, isLastImage, storyImages.length])

  if (storyImages.length === 0) {
    return (
      <div className='episode-page'>
        <div className='episode-page__back-area'>
          <BackButton onClick={handleBack} />
        </div>

        <div className='episode-page__empty'>표시할 에피소드가 없어요.</div>
      </div>
    )
  }

  return (
    <div className='episode-page'>
      <div className='episode-page__back-area'>
        <BackButton onClick={handleBack} />
      </div>

      <main className='episode-page__content' onClick={handleStoryClick}>
        {storyImages.map((image, index) => (
          <img
            key={image}
            src={image}
            alt={`에피소드 ${episodeNumber} 스토리 ${index + 1}`}
            className={`episode-page__story-image ${index === currentIndex ? 'active' : ''}`}
            draggable={false}
          />
        ))}
      </main>

      <footer className={`episode-page__footer ${isLastImage ? 'active' : ''}`}>
        {isLastImage && <BottomButton onClick={handleNext}>확인</BottomButton>}
      </footer>
    </div>
  )
}

export default EpisodePage
