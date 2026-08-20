import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

import { getStories } from '../../../api/storyApi'

import episodeOneImage from '../../../assets/home-bottom-sheet/image-Rectangle.svg'

import './Episode.css'

const EPISODE_CONTENT = {
  1: {
    title: '에피소드 1',
    image: episodeOneImage,
    alt: '에피소드 1 스토리',
  },
}

function findDisplayEpisode(storyData) {
  const episodes = storyData?.episodes ?? []

  const availableEpisodes = episodes
    .filter((episode) => EPISODE_CONTENT[episode.episodeNumber])
    .sort((first, second) => first.episodeNumber - second.episodeNumber)

  const unlockedEpisodes = availableEpisodes.filter((episode) => episode.unlocked)

  if (unlockedEpisodes.length > 0) {
    return unlockedEpisodes[unlockedEpisodes.length - 1]
  }

  return availableEpisodes[0] ?? null
}

function Episode({ onClose }) {
  const [storyData, setStoryData] = useState(null)

  const [isLoading, setIsLoading] = useState(true)

  const [errorMessage, setErrorMessage] = useState('')

  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let isActive = true

    const loadStories = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const response = await getStories()

        if (!isActive) return

        setStoryData(response)
      } catch (error) {
        if (!isActive) return

        console.error('에피소드 정보를 불러오지 못했습니다.', error)

        setErrorMessage(error.message ?? '에피소드 정보를 불러오지 못했습니다.')
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadStories()

    return () => {
      isActive = false
    }
  }, [reloadKey])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow

      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const displayEpisode = useMemo(() => {
    return findDisplayEpisode(storyData)
  }, [storyData])

  const episodeContent = displayEpisode ? EPISODE_CONTENT[displayEpisode.episodeNumber] : null

  const currentStreakDays = storyData?.currentStreakDays ?? 0

  const requiredStreakDays = displayEpisode?.requiredStreakDays ?? 0

  const progress =
    requiredStreakDays > 0 ? Math.min(100, (currentStreakDays / requiredStreakDays) * 100) : 0

  const handleRetry = () => {
    setReloadKey((previous) => previous + 1)
  }

  return createPortal(
    <div className='episode-popup__overlay' onClick={onClose}>
      <section
        className='episode-popup'
        role='dialog'
        aria-modal='true'
        aria-labelledby='episode-popup-title'
        onClick={(event) => event.stopPropagation()}
      >
        <div className='episode-popup__handle' />

        {isLoading && (
          <>
            <h2 id='episode-popup-title' className='episode-popup__title'>
              에피소드
            </h2>

            <div className='episode-popup__status' role='status'>
              에피소드를 불러오고 있어요
            </div>
          </>
        )}

        {!isLoading && errorMessage && (
          <>
            <h2 id='episode-popup-title' className='episode-popup__title'>
              에피소드
            </h2>

            <div className='episode-popup__status'>
              <p>{errorMessage}</p>

              <button type='button' className='episode-popup__retry' onClick={handleRetry}>
                다시 불러오기
              </button>
            </div>
          </>
        )}

        {!isLoading && !errorMessage && !displayEpisode && (
          <>
            <h2 id='episode-popup-title' className='episode-popup__title'>
              에피소드
            </h2>

            <div className='episode-popup__status'>표시할 에피소드가 없어요</div>
          </>
        )}

        {!isLoading && !errorMessage && displayEpisode && episodeContent && (
          <>
            <h2 id='episode-popup-title' className='episode-popup__title'>
              {episodeContent.title}
            </h2>

            <div
              className={`episode-popup__story ${
                displayEpisode.unlocked ? '' : 'episode-popup__story--locked'
              }`}
            >
              <img
                className='episode-popup__story-image'
                src={episodeContent.image}
                alt={episodeContent.alt}
              />

              {!displayEpisode.unlocked && (
                <div className='episode-popup__locked'>
                  <svg width='32' height='32' viewBox='0 0 32 32' fill='none' aria-hidden='true'>
                    <rect x='7' y='14' width='18' height='14' rx='4' fill='currentColor' />

                    <path
                      d='M11 14V10a5 5 0 0 1 10 0v4'
                      stroke='currentColor'
                      strokeWidth='3'
                      strokeLinecap='round'
                    />
                  </svg>

                  <strong>아직 잠겨 있어요</strong>

                  <span>{requiredStreakDays}일 연속 달성하면 열려요</span>
                </div>
              )}
            </div>

            {!displayEpisode.unlocked && (
              <div className='episode-popup__progress'>
                <div className='episode-popup__progress-text'>
                  <span>현재 {currentStreakDays}일</span>

                  <span>{requiredStreakDays}일</span>
                </div>

                <div className='episode-popup__progress-track'>
                  <div
                    className='episode-popup__progress-value'
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </>
        )}

        <button type='button' className='episode-popup__confirm' onClick={onClose}>
          확인했어요
        </button>
      </section>
    </div>,
    document.body,
  )
}

export default Episode
