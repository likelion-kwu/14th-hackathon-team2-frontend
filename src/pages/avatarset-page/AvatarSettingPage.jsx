import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './AvatarSettingPage.css'

import MainTitle from '../../components/initial-page-title/MainTitle'
import SubTitle from '../../components/initial-page-title/SubTitle'
import BackButton from '../../components/back-button/BackButton'
import BottomButton from '../../components/bottom-button/BottomButton'

import PopupPage from './popup-page/PopupPage'

function stopCameraStream(stream) {
  stream?.getTracks().forEach((track) => {
    track.stop()
  })
}

function getCameraErrorMessage(error) {
  switch (error.name) {
    case 'NotAllowedError':
      return '카메라 권한이 거부됐어요. 브라우저 설정에서 카메라 권한을 허용해 주세요.'

    case 'NotFoundError':
      return '사용할 수 있는 카메라를 찾지 못했어요.'

    case 'NotReadableError':
      return '다른 앱에서 카메라를 사용 중인지 확인해 주세요.'

    default:
      return '카메라를 실행하지 못했어요.'
  }
}

function AvatarSettingPage() {
  const navigate = useNavigate()

  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isCameraLoading, setIsCameraLoading] = useState(false)
  const [cameraStream, setCameraStream] = useState(null)

  const [capturedPhoto, setCapturedPhoto] = useState({
    file: null,
    url: '',
  })

  // 다시 촬영하거나 페이지를 나갈 때 이전 사진 URL 제거
  useEffect(() => {
    return () => {
      if (capturedPhoto.url) {
        URL.revokeObjectURL(capturedPhoto.url)
      }
    }
  }, [capturedPhoto.url])

  // 페이지를 나가거나 카메라 스트림이 변경될 때 카메라 종료
  useEffect(() => {
    return () => {
      stopCameraStream(cameraStream)
    }
  }, [cameraStream])

  const handleBack = () => {
    navigate('/tracksetting')
  }

  const handleOpenPopup = async () => {
    if (isCameraLoading) return

    if (!window.isSecureContext) {
      alert('카메라는 HTTPS 또는 localhost에서만 사용할 수 있어요.')
      return
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      alert('현재 브라우저에서는 카메라 기능을 지원하지 않아요.')
      return
    }

    setIsCameraLoading(true)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: {
            ideal: 1280,
          },
          height: {
            ideal: 960,
          },
        },
        audio: false,
      })

      setCameraStream(stream)
      setIsPopupOpen(true)
    } catch (error) {
      alert(getCameraErrorMessage(error))
    } finally {
      setIsCameraLoading(false)
    }
  }

  const handleClosePopup = () => {
    stopCameraStream(cameraStream)

    setCameraStream(null)
    setIsPopupOpen(false)
  }

  const handlePhotoCapture = (photoFile) => {
    const photoUrl = URL.createObjectURL(photoFile)

    setCapturedPhoto({
      file: photoFile,
      url: photoUrl,
    })

    stopCameraStream(cameraStream)

    setCameraStream(null)
    setIsPopupOpen(false)
  }

  const handleNext = () => {
    /*
     * 실제 촬영된 파일은 capturedPhoto.file에 저장되어 있어.
     * 추후 백엔드 연결 시 이 파일을 전송하면 돼.
     */

    navigate('/story')
  }

  return (
    <div className='avatar-setting-page'>
      <div className='avatar-setting-page__back-area'>
        <BackButton onClick={handleBack} />
      </div>

      <div className='avatar-setting-page__scroll-area'>
        <div className='avatar-setting-page__header'>
          <MainTitle>
            나만의 아바타를
            <br />
            만들어봐요
          </MainTitle>

          <SubTitle>추후 커스터마이징에서 수정할 수 있어요.</SubTitle>
        </div>

        <main className='avatar-setting-page__content'>
          <section className='avatar-setting-page__section'>
            <h2 className='avatar-setting-page__section-title'>아바타 생성</h2>

            <button
              className='avatar-setting-page__generator'
              type='button'
              disabled={isCameraLoading}
              aria-busy={isCameraLoading}
              aria-label={capturedPhoto.url ? '사진 다시 촬영하기' : '아바타 생성용 사진 촬영하기'}
              onClick={handleOpenPopup}
            >
              {isCameraLoading ? (
                '카메라 연결 중...'
              ) : capturedPhoto.url ? (
                <img
                  className='avatar-setting-page__captured-photo'
                  src={capturedPhoto.url}
                  alt='촬영한 내 모습'
                />
              ) : (
                '여기를 클릭해 아바타 생성하기'
              )}
            </button>
          </section>

          <section className='avatar-setting-page__section avatar-setting-page__response'>
            <h2 className='avatar-setting-page__section-title'>아바타 응답 선택</h2>

            <div className='avatar-setting-page__speech-options'>
              <label className='avatar-setting-page__speech-option'>
                <input type='radio' name='speech-level' value='casual' defaultChecked />
                <span>반말</span>
              </label>

              <label className='avatar-setting-page__speech-option'>
                <input type='radio' name='speech-level' value='polite' />
                <span>존댓말</span>
              </label>
            </div>

            <div className='avatar-setting-page__length-options'>
              <label className='avatar-setting-page__length-option'>
                <input type='radio' name='response-length' value='short' defaultChecked />
                <span>짧은 응답</span>
              </label>

              <label className='avatar-setting-page__length-option'>
                <input type='radio' name='response-length' value='normal' />
                <span>보통 응답</span>
              </label>

              <label className='avatar-setting-page__length-option'>
                <input type='radio' name='response-length' value='long' />
                <span>자세한 응답</span>
              </label>
            </div>

            <div className='avatar-setting-page__style-options'>
              <label className='avatar-setting-page__style-option'>
                <input type='radio' name='speech-style' value='kind' defaultChecked />
                <span>다정함</span>
              </label>

              <label className='avatar-setting-page__style-option'>
                <input type='radio' name='speech-style' value='cranky' />
                <span>까칠함</span>
              </label>

              <label className='avatar-setting-page__style-option'>
                <input type='radio' name='speech-style' value='playful' />
                <span>장난스러움</span>
              </label>
            </div>
          </section>
        </main>
      </div>

      <footer className='avatar-setting-page__footer'>
        <div className='avatar-setting-page__bottom-bar' aria-hidden='true'>
          <span />
          <span />
          <span className='avatar-setting-page__bottom-dot--active' />
          <span />
        </div>

        <BottomButton onClick={handleNext}>다음</BottomButton>
      </footer>

      {isPopupOpen && cameraStream && (
        <PopupPage
          stream={cameraStream}
          onClose={handleClosePopup}
          onCapture={handlePhotoCapture}
        />
      )}
    </div>
  )
}

export default AvatarSettingPage
