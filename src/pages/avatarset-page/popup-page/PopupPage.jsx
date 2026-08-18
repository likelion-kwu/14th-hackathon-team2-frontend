import { useEffect, useRef, useState } from 'react'

import './PopupPage.css'
import imageRectangle from '../../../assets/popup-page/image-rectangle.svg'

function PopupPage({ stream, onClose, onCapture }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const [isCameraReady, setIsCameraReady] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const video = videoRef.current

    if (!video || !stream) return undefined

    video.srcObject = stream

    const playCamera = async () => {
      try {
        await video.play()
      } catch {
        setErrorMessage('카메라 화면을 재생하지 못했어요.')
      }
    }

    playCamera()

    return () => {
      video.srcObject = null
    }
  }, [stream])

  const handleSheetClick = (event) => {
    event.stopPropagation()
  }

  const handleCapture = () => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas || !isCameraReady) {
      setErrorMessage('카메라 화면을 불러오는 중이에요.')
      return
    }

    const width = video.videoWidth
    const height = video.videoHeight

    if (width === 0 || height === 0) {
      setErrorMessage('촬영할 화면을 불러오지 못했어요.')
      return
    }

    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')

    if (!context) {
      setErrorMessage('사진을 처리하지 못했어요.')
      return
    }

    /*
     * 전면 카메라 미리보기와 촬영 결과의
     * 좌우 방향을 동일하게 맞춤
     */
    context.save()
    context.translate(width, 0)
    context.scale(-1, 1)
    context.drawImage(video, 0, 0, width, height)
    context.restore()

    /*
     * canvas 화면을 JPEG 이미지로 변환
     */
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setErrorMessage('사진 촬영에 실패했어요.')
          return
        }

        const photoFile = new File([blob], `avatar-photo-${Date.now()}.jpg`, {
          type: 'image/jpeg',
        })

        /*
         * AvatarSettingPage의
         * handlePhotoCapture(photoFile)가 실행됨
         */
        onCapture(photoFile)
      },
      'image/jpeg',
      0.9,
    )
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
          <img className='popup-page__preview-placeholder' src={imageRectangle} alt='' />

          <video
            ref={videoRef}
            className='popup-page__video'
            autoPlay
            muted
            playsInline
            aria-label='카메라 미리보기'
            onCanPlay={() => setIsCameraReady(true)}
          />

          <canvas ref={canvasRef} className='popup-page__canvas' aria-hidden='true' />
        </div>

        {errorMessage && (
          <p className='popup-page__error' role='alert'>
            {errorMessage}
          </p>
        )}

        <button
          className='popup-page__continue-button'
          type='button'
          disabled={!isCameraReady}
          onClick={handleCapture}
        >
          {isCameraReady ? '이 모습으로 계속하기' : '카메라 연결 중...'}
        </button>
      </section>
    </div>
  )
}

export default PopupPage
