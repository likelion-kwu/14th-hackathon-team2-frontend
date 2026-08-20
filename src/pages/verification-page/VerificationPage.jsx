import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { getPhotoMission, verifyRoutineCheck, verifyRoutinePhoto } from '../../api/verificationApi'

import imageSkin from '../../assets/home-bottom-sheet/character/image-skin.svg'

import './VerificationPage.css'

const FALLBACK_ROUTINE = {
  id: 0,
  dailyRoutineId: null,
  category: 'Skin',
  title: '루틴',
  theme: 'skin',
  characterImage: imageSkin,
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024

function getCameraErrorMessage(error) {
  if (error?.name === 'NotAllowedError' || error?.name === 'SecurityError') {
    return '브라우저 설정에서 카메라 권한을 허용해 주세요.'
  }

  if (error?.name === 'NotFoundError' || error?.name === 'DevicesNotFoundError') {
    return '사용할 수 있는 카메라를 찾지 못했어요.'
  }

  if (error?.name === 'NotReadableError' || error?.name === 'TrackStartError') {
    return '다른 프로그램에서 카메라를 사용하고 있어요.'
  }

  if (error?.name === 'OverconstrainedError') {
    return '현재 기기에서 요청한 카메라 설정을 사용할 수 없어요.'
  }

  if (error?.name === 'AbortError') {
    return '카메라 실행이 중단됐어요. 다시 시도해 주세요.'
  }

  return '카메라를 실행하지 못했어요.'
}

function VerificationStatus({ status }) {
  if (status === 'success') {
    return (
      <div className='verificationPage__status verificationPage__status--success'>
        <svg width='30' height='30' viewBox='0 0 30 30' fill='none' aria-hidden='true'>
          <path
            d='m7 15 5.2 5L23 9.5'
            stroke='currentColor'
            strokeWidth='4'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </div>
    )
  }

  if (status === 'failure') {
    return (
      <div className='verificationPage__status verificationPage__status--failure'>
        <svg width='28' height='28' viewBox='0 0 28 28' fill='none' aria-hidden='true'>
          <path
            d='m7 7 14 14M21 7 7 21'
            stroke='currentColor'
            strokeWidth='4'
            strokeLinecap='round'
          />
        </svg>
      </div>
    )
  }

  return (
    <div className='verificationPage__status verificationPage__status--verifying'>
      <span />
      <span />
      <span />
    </div>
  )
}

function VerificationPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const fileInputRef = useRef(null)
  const successTimerRef = useRef(null)
  const capturedImageUrlRef = useRef(null)
  const cameraRequestIdRef = useRef(0)

  const routine = location.state?.routine ?? FALLBACK_ROUTINE

  const dailyRoutineId = routine.dailyRoutineId ?? routine.id

  const [status, setStatus] = useState('verifying')

  const [capturedImage, setCapturedImage] = useState(null)

  const [cameraError, setCameraError] = useState('')

  const [isCameraReady, setIsCameraReady] = useState(false)

  const [cameraSession, setCameraSession] = useState(0)

  const [missionData, setMissionData] = useState(null)

  const [isMissionLoading, setIsMissionLoading] = useState(Boolean(dailyRoutineId))

  const [missionError, setMissionError] = useState('')

  const [verificationError, setVerificationError] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [canRetryPhoto, setCanRetryPhoto] = useState(true)

  const [canUseCheck, setCanUseCheck] = useState(false)

  const stopCamera = useCallback(() => {
    cameraRequestIdRef.current += 1

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop()
      })

      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  const clearCapturedImage = useCallback(() => {
    const currentImageUrl = capturedImageUrlRef.current

    if (currentImageUrl) {
      URL.revokeObjectURL(currentImageUrl)

      capturedImageUrlRef.current = null
    }

    setCapturedImage(null)
  }, [])

  const setCapturedImageUrl = useCallback((imageUrl) => {
    const previousImageUrl = capturedImageUrlRef.current

    if (previousImageUrl) {
      URL.revokeObjectURL(previousImageUrl)
    }

    capturedImageUrlRef.current = imageUrl

    setCapturedImage(imageUrl)
  }, [])

  const handleVerificationSuccess = useCallback(
    (result) => {
      setStatus('success')
      setVerificationError('')
      setCanUseCheck(false)
      stopCamera()

      window.clearTimeout(successTimerRef.current)

      successTimerRef.current = window.setTimeout(() => {
        navigate('/home', {
          replace: true,
          state: {
            verificationResult: result,
          },
        })
      }, 1200)
    },
    [navigate, stopCamera],
  )

  const submitPhoto = useCallback(
    async (photo) => {
      if (!dailyRoutineId || isSubmitting) {
        return
      }

      setIsSubmitting(true)
      setStatus('verifying')
      setVerificationError('')
      setCanUseCheck(false)

      try {
        const result = await verifyRoutinePhoto(dailyRoutineId, photo)

        handleVerificationSuccess(result)
      } catch (error) {
        console.error('사진 인증 실패:', error)

        setStatus('failure')

        setVerificationError(error.message ?? '사진 인증에 실패했습니다.')

        setCanRetryPhoto(error.data?.canRetryPhoto ?? error.code !== 'ROUTINE_WINDOW_CLOSED')

        setCanUseCheck(Boolean(error.data?.canUseCheck))
      } finally {
        setIsSubmitting(false)
      }
    },
    [dailyRoutineId, handleVerificationSuccess, isSubmitting],
  )

  const submitCheck = useCallback(async () => {
    if (!dailyRoutineId || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setStatus('verifying')
    setVerificationError('')
    setCanUseCheck(false)

    try {
      const result = await verifyRoutineCheck(dailyRoutineId)

      handleVerificationSuccess(result)
    } catch (error) {
      console.error('체크 인증 실패:', error)

      setStatus('failure')

      setVerificationError(error.message ?? '체크 인증에 실패했습니다.')

      setCanRetryPhoto(false)
      setCanUseCheck(false)
    } finally {
      setIsSubmitting(false)
    }
  }, [dailyRoutineId, handleVerificationSuccess, isSubmitting])

  const startCamera = useCallback(async () => {
    stopCamera()

    const requestId = cameraRequestIdRef.current + 1

    cameraRequestIdRef.current = requestId

    setCameraError('')
    setIsCameraReady(false)

    if (!window.isSecureContext) {
      setCameraError('카메라는 localhost 또는 HTTPS 환경에서만 사용할 수 있어요.')

      setCanUseCheck(true)
      return
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('현재 브라우저에서는 카메라를 사용할 수 없어요.')

      setCanUseCheck(true)
      return
    }

    let stream = null

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: 'environment',
          },
          width: {
            ideal: 1280,
          },
          height: {
            ideal: 720,
          },
        },
        audio: false,
      })

      if (cameraRequestIdRef.current !== requestId) {
        stream.getTracks().forEach((track) => {
          track.stop()
        })

        return
      }

      const video = videoRef.current

      if (!video) {
        stream.getTracks().forEach((track) => {
          track.stop()
        })

        return
      }

      streamRef.current = stream
      video.srcObject = stream
      video.muted = true
      video.playsInline = true

      await video.play()

      if (cameraRequestIdRef.current === requestId) {
        setIsCameraReady(true)
      }
    } catch (error) {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop()
        })
      }

      if (cameraRequestIdRef.current !== requestId) {
        return
      }

      streamRef.current = null

      console.error('카메라 실행 실패:', error)

      setCameraError(getCameraErrorMessage(error))

      setIsCameraReady(false)
      setCanUseCheck(true)
    }
  }, [stopCamera])

  useEffect(() => {
    if (!dailyRoutineId) {
      return undefined
    }

    let isActive = true

    const loadMission = async () => {
      try {
        const response = await getPhotoMission(dailyRoutineId)

        if (!isActive) return

        setMissionData(response)
      } catch (error) {
        if (!isActive) return

        console.error('사진 미션 조회 실패:', error)

        setMissionError(error.message ?? '사진 미션을 불러오지 못했습니다.')
      } finally {
        if (isActive) {
          setIsMissionLoading(false)
        }
      }
    }

    loadMission()

    return () => {
      isActive = false
    }
  }, [dailyRoutineId])

  useEffect(() => {
    const cameraStartTimer = window.setTimeout(() => {
      void startCamera()
    }, 0)

    return () => {
      window.clearTimeout(cameraStartTimer)

      stopCamera()
    }
  }, [cameraSession, startCamera, stopCamera])

  useEffect(() => {
    return () => {
      window.clearTimeout(successTimerRef.current)

      const currentImageUrl = capturedImageUrlRef.current

      if (currentImageUrl) {
        URL.revokeObjectURL(currentImageUrl)

        capturedImageUrlRef.current = null
      }
    }
  }, [])

  const handleBack = () => {
    navigate(-1)
  }

  const handleCapture = () => {
    const video = videoRef.current

    if (!video || !isCameraReady || isSubmitting) {
      setCameraError('카메라가 아직 준비되지 않았어요.')

      return
    }

    if (!video.videoWidth || !video.videoHeight) {
      setCameraError('카메라 화면을 불러오는 중이에요.')

      return
    }

    const canvas = document.createElement('canvas')

    const context = canvas.getContext('2d')

    if (!context) {
      setCameraError('사진을 처리하지 못했어요.')

      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    stopCamera()
    setIsCameraReady(false)

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setCameraError('촬영한 사진을 저장하지 못했어요.')

          setCameraSession((previous) => previous + 1)

          return
        }

        const photo = new File([blob], 'routine-verification.jpg', {
          type: 'image/jpeg',
        })

        const imageUrl = URL.createObjectURL(photo)

        setCapturedImageUrl(imageUrl)
        void submitPhoto(photo)
      },
      'image/jpeg',
      0.9,
    )
  }

  const handleGalleryClick = () => {
    if (capturedImage || isSubmitting) {
      return
    }

    fileInputRef.current?.click()
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]

    event.target.value = ''

    if (!file) return

    if (file.type !== 'image/jpeg') {
      setCameraError('JPG 형식의 이미지만 선택할 수 있어요.')

      return
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setCameraError('10MB 이하의 이미지를 선택해 주세요.')

      return
    }

    stopCamera()
    setIsCameraReady(false)

    const imageUrl = URL.createObjectURL(file)

    setCapturedImageUrl(imageUrl)
    void submitPhoto(file)
  }

  const handleRetry = () => {
    if (isSubmitting) return

    clearCapturedImage()
    setStatus('verifying')
    setVerificationError('')
    setCameraError('')
    setCanRetryPhoto(true)
    setCanUseCheck(false)
    setIsCameraReady(false)

    setCameraSession((previous) => previous + 1)
  }

  const handleFailureClose = () => {
    if (canRetryPhoto) {
      handleRetry()
      return
    }

    navigate('/home', {
      replace: true,
    })
  }

  const missionInstruction = missionData?.mission?.instruction

  const resolvedMissionError = !dailyRoutineId ? '인증할 루틴 정보가 없습니다.' : missionError

  const isCaptureDisabled =
    !isCameraReady ||
    Boolean(capturedImage) ||
    isSubmitting ||
    isMissionLoading ||
    Boolean(resolvedMissionError)

  const isGalleryDisabled =
    Boolean(capturedImage) || isSubmitting || isMissionLoading || Boolean(resolvedMissionError)
  return (
    <main className='verificationPage'>
      <div className='verificationPage__camera'>
        {!capturedImage && (
          <video ref={videoRef} className='verificationPage__video' autoPlay muted playsInline />
        )}

        {capturedImage && (
          <img
            src={capturedImage}
            alt='촬영한 루틴 인증 사진'
            className='verificationPage__captured-image'
          />
        )}

        {cameraError && !capturedImage && (
          <div className='verificationPage__camera-error'>{cameraError}</div>
        )}
      </div>

      <header className='verificationPage__header'>
        <button
          type='button'
          className='verificationPage__back-button'
          aria-label='이전 화면으로 돌아가기'
          onClick={handleBack}
        >
          <svg width='28' height='28' viewBox='0 0 28 28' fill='none' aria-hidden='true'>
            <path
              d='m17 6-8 8 8 8'
              stroke='currentColor'
              strokeWidth='2.8'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>

        <h1 className='verificationPage__title'>루틴 인증</h1>
      </header>

      <section className='verificationPage__routine'>
        <div
          className={`verificationPage__character-area verificationPage__character-area--${routine.theme}`}
        >
          <img
            src={routine.characterImage}
            alt={`${routine.category} 캐릭터`}
            className='verificationPage__character'
          />
        </div>

        <div className='verificationPage__routine-text'>
          <span className='verificationPage__category'>{routine.category}</span>

          <strong className='verificationPage__routine-title'>{routine.title}</strong>
        </div>

        <VerificationStatus status={status} />
      </section>

      <section className='verificationPage__mission'>
        {isMissionLoading && <span>사진 미션을 불러오고 있어요</span>}

        {!isMissionLoading && resolvedMissionError && <span>{resolvedMissionError}</span>}

        {!isMissionLoading && !resolvedMissionError && missionInstruction && (
          <>
            <strong>오늘의 미션</strong>
            <span>{missionInstruction}</span>
          </>
        )}
      </section>

      {status === 'failure' && (
        <section
          className='verificationPage__failure-popup'
          role='dialog'
          aria-modal='true'
          aria-label='루틴 인증 실패'
        >
          <h2 className='verificationPage__failure-title'>인증하지 못했어요</h2>

          <p className='verificationPage__failure-description'>{verificationError}</p>

          <div className='verificationPage__failure-actions'>
            <button
              type='button'
              className='verificationPage__failure-confirm'
              onClick={handleFailureClose}
              disabled={isSubmitting}
            >
              {canRetryPhoto ? '다시 촬영' : '홈으로'}
            </button>

            {canUseCheck && (
              <button
                type='button'
                className='verificationPage__failure-check'
                onClick={() => void submitCheck()}
                disabled={isSubmitting}
              >
                체크로 인증
              </button>
            )}
          </div>
        </section>
      )}

      {cameraError && canUseCheck && status !== 'failure' && (
        <button
          type='button'
          className='verificationPage__camera-check'
          onClick={() => void submitCheck()}
          disabled={isSubmitting}
        >
          사진 없이 체크로 인증
        </button>
      )}

      <div className='verificationPage__controls'>
        <button
          type='button'
          className='verificationPage__capture-button'
          aria-label='사진 촬영하기'
          disabled={isCaptureDisabled}
          onClick={handleCapture}
        />

        <button
          type='button'
          className='verificationPage__gallery-button'
          aria-label='갤러리에서 사진 선택하기'
          disabled={isGalleryDisabled}
          onClick={handleGalleryClick}
        >
          <svg width='26' height='26' viewBox='0 0 26 26' fill='none' aria-hidden='true'>
            <rect
              x='3.5'
              y='5'
              width='19'
              height='16'
              rx='2'
              stroke='currentColor'
              strokeWidth='2'
            />

            <circle cx='9' cy='10' r='2' fill='currentColor' />

            <path
              d='m5.5 18 5-5 3.5 3 2.5-2.5 4 4'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>

        <input
          ref={fileInputRef}
          type='file'
          className='verificationPage__file-input'
          accept='image/jpeg'
          onChange={handleFileChange}
        />
      </div>
    </main>
  )
}

export default VerificationPage
