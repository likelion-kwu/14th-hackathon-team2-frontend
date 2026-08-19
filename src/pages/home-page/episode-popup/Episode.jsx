import { createPortal } from 'react-dom'

import './Episode.css'

import episodeImage from '../../../assets/home-bottom-sheet/image-Rectangle.svg'

function Episode({ onClose }) {
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

        <h2 id='episode-popup-title' className='episode-popup__title'>
          에피소드 1
        </h2>

        <div className='episode-popup__story'>
          <img className='episode-popup__story-image' src={episodeImage} alt='에피소드 1 스토리' />
        </div>

        <button type='button' className='episode-popup__confirm' onClick={onClose}>
          확인했어요
        </button>
      </section>
    </div>,
    document.body,
  )
}

export default Episode
