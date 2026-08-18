import './TrackSettingPage.css'

import BackButton from '../../components/back-button/BackButton'
import BottomButton from '../../components/bottom-button/BottomButton'

import dietActiveImage from '../../assets/icons/icons-track/image-diet-active.svg'
import dietDefaultImage from '../../assets/icons/icons-track/image-diet-default.svg'
import healthActiveImage from '../../assets/icons/icons-track/image-health-active.svg'
import healthDefaultImage from '../../assets/icons/icons-track/image-health-default.svg'
import skinActiveImage from '../../assets/icons/icons-track/image-skin-active.svg'
import skinDefaultImage from '../../assets/icons/icons-track/image-skin-default.svg'
import wellbeingActiveImage from '../../assets/icons/icons-track/image-wellbeing-active.svg'
import wellbeingDefaultImage from '../../assets/icons/icons-track/image-wellbeing-default.svg'

const TRACK_LIST = [
  {
    id: 'skin',
    label: 'Skin',
    defaultImage: skinDefaultImage,
    activeImage: skinActiveImage,
  },
  {
    id: 'wellbeing',
    label: 'Well-being',
    defaultImage: wellbeingDefaultImage,
    activeImage: wellbeingActiveImage,
  },
  {
    id: 'health',
    label: 'Health & Fit',
    defaultImage: healthDefaultImage,
    activeImage: healthActiveImage,
  },
  {
    id: 'diet',
    label: 'Diet',
    defaultImage: dietDefaultImage,
    activeImage: dietActiveImage,
  },
]

function TrackSettingPage() {
  return (
    <div className='track-setting-page'>
      <div className='track-setting-page__back-area'>
        <BackButton />
      </div>

      <div className='track-setting-page__header'>
        <h1 className='track-setting-page__title'>
          어떤 변화를 만들어보고
          <br />
          싶으신가요?
        </h1>

        <p className='track-setting-page__description'>트랙을 하나 이상 선택해 주세요</p>
      </div>

      <div className='track-setting-page__track-list'>
        {TRACK_LIST.map((track) => (
          <button key={track.id} className='track-setting-page__track-button' type='button'>
            <img
              className='track-setting-page__track-image track-setting-page__track-image--default'
              src={track.defaultImage}
              alt={track.label}
            />

            <img
              className='track-setting-page__track-image track-setting-page__track-image--active'
              src={track.activeImage}
              alt=''
            />
          </button>
        ))}
      </div>

      <div className='track-setting-page__bottom-bar' aria-hidden='true'>
        <span />
        <span className='track-setting-page__bottom-dot--active' />
        <span />
        <span />
      </div>

      <BottomButton disabled>다음</BottomButton>
    </div>
  )
}

export default TrackSettingPage
