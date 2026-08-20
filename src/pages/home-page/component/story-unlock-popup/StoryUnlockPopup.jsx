import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'

import './StoryUnlockPopup.css'

function StoryUnlockPopup({ episode, onClose, onView }) {
  const navigate = useNavigate()

  if (!episode) return null

  const handleStoryView = () => {
    onView?.()

    navigate(`/episode?episode=${episode.episodeNumber}`)
  }

  return createPortal(
    <div className='story-unlock-popup__overlay'>
      <section
        className='story-unlock-popup'
        role='dialog'
        aria-modal='true'
        aria-label={`에피소드 ${episode.episodeNumber} 해금`}
      >
        <button
          type='button'
          className='story-unlock-popup__close'
          onClick={onClose}
          aria-label='팝업 닫기'
        >
          ×
        </button>

        <div className='story-unlock-popup__content'>
          <div className='story-unlock-popup__description'>
            {episode.requiredStreakDays}일 연속 달성!
          </div>

          <div className='story-unlock-popup__title'>
            에피소드 {episode.episodeNumber}로
            <br />
            넘어갈게요
          </div>

          <button type='button' className='story-unlock-popup__button' onClick={handleStoryView}>
            스토리 보기
          </button>
        </div>
      </section>
    </div>,
    document.body,
  )
}

export default StoryUnlockPopup
