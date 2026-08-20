import './TrackSettingPage.css'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import MainTitle from '../../components/initial-page-title/MainTitle'
import SubTitle from '../../components/initial-page-title/SubTitle'
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

import bottomBarImage from '../../assets/tracksetting-page/image-bottombar3.svg'

const GROWTH_TRACK_KEY = 'selected_growth_track'

const TRACK_LIST = [
  {
    id: 'SKIN',
    label: 'Skin',
    defaultImage: skinDefaultImage,
    activeImage: skinActiveImage,
  },
  {
    id: 'WELL_BEING',
    label: 'Well-being',
    defaultImage: wellbeingDefaultImage,
    activeImage: wellbeingActiveImage,
  },
  {
    id: 'HEALTH_FIT',
    label: 'Health & Fit',
    defaultImage: healthDefaultImage,
    activeImage: healthActiveImage,
  },
  {
    id: 'DIET',
    label: 'Diet',
    defaultImage: dietDefaultImage,
    activeImage: dietActiveImage,
  },
]

function TrackSettingPage() {
  const navigate = useNavigate()

  const [selectedTrack, setSelectedTrack] = useState(
    () => sessionStorage.getItem(GROWTH_TRACK_KEY) ?? '',
  )

  const handleBack = () => {
    navigate(-1)
  }

  const handleTrackChange = (trackId) => {
    setSelectedTrack(trackId)
  }

  const handleNext = () => {
    if (!selectedTrack) return

    sessionStorage.setItem(GROWTH_TRACK_KEY, selectedTrack)

    navigate('/avatarsetting')
  }

  return (
    <div className='track-setting-page'>
      <div className='track-setting-page__back-area'>
        <BackButton onClick={handleBack} />
      </div>

      <div className='track-setting-page__header'>
        <MainTitle>
          어떤 변화를 만들어보고
          <br />
          싶으신가요?
        </MainTitle>

        <SubTitle>트랙을 하나 선택해 주세요.</SubTitle>
      </div>

      <div className='track-setting-page__track-list'>
        {TRACK_LIST.map((track) => {
          const isSelected = selectedTrack === track.id

          return (
            <label key={track.id} className='track-setting-page__track-option'>
              <input
                className='track-setting-page__track-checkbox'
                type='radio'
                name='growth-track'
                value={track.id}
                checked={isSelected}
                onChange={() => handleTrackChange(track.id)}
              />

              <span className='track-setting-page__track-visual'>
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
              </span>
            </label>
          )
        })}
      </div>

      <img className='track-setting-page__bottom-bar' src={bottomBarImage} alt='' />

      <BottomButton onClick={handleNext} disabled={!selectedTrack}>
        다음
      </BottomButton>
    </div>
  )
}

export default TrackSettingPage
