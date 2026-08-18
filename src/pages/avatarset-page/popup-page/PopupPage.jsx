import './PopupPage.css'
import imageRectangle from '../../../assets/popup-page/image-rectangle.svg'

function PopupPage({ onClose }) {
  const handleSheetClick = (event) => {
    event.stopPropagation()
  }

  return (
    <div
      className='popup-page'
      role='dialog'
      aria-modal='true'
      aria-labelledby='avatar-popup-title'
      onClick={onClose}
    >
      <section className='popup-page__sheet' onClick={handleSheetClick}>
        <div className='popup-page__handle' aria-hidden='true' />

        <h2 id='avatar-popup-title' className='popup-page__title'>
          내 모습 촬영하기
        </h2>

        <p className='popup-page__description'>너무 어둡거나 밝은 곳, 조명이 아래는 피해 주세요</p>

        <div className='popup-page__preview'>
          <img
            className='popup-page__preview-image'
            src={imageRectangle}
            alt='촬영한 사진 미리보기 영역'
          />
        </div>

        <button className='popup-page__continue-button' type='button' onClick={onClose}>
          이 모습으로 계속하기
        </button>
      </section>
    </div>
  )
}

export default PopupPage
