import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getAvatarImage } from '../../../api/avatarApi'
import {
  analyzeKakaoSpeechStyleJob,
  createKakaoSpeechStyleJob,
  getKakaoSpeechStyleJob,
  getSpeechStyle,
  updateSpeechStyle,
} from '../../../api/speechStyleApi'

import { Icon } from '../../../components/icon/Icon'

import dummyProflie from '../../../assets/avatar/avatar-default/dummy-profile.png'

import './SettingPage.css'

const DEFAULT_SELECTED = {
  speech: '반말',
  length: '보통 응답',
  personality: '까칠함',
}

const PERSONALITY_SETTINGS = {
  다정함: {
    directness: 'MEDIUM',
    warmth: 'HIGH',
    playfulness: 'LOW',
  },
  까칠함: {
    directness: 'HIGH',
    warmth: 'LOW',
    playfulness: 'LOW',
  },
  장난스러움: {
    directness: 'MEDIUM',
    warmth: 'MEDIUM',
    playfulness: 'HIGH',
  },
}

function getResponseData(response) {
  return response?.data ?? response
}

function getSelectedSettings(settings) {
  const lengthMap = {
    SHORT: '짧은 응답',
    MEDIUM: '보통 응답',
    LONG: '자세한 응답',
  }

  let personality = '까칠함'

  if (settings.playfulness === 'HIGH') {
    personality = '장난스러움'
  } else if (settings.warmth === 'HIGH') {
    personality = '다정함'
  }

  return {
    speech: settings.speechLevel === 'BANMAL' ? '반말' : '존댓말',
    length: lengthMap[settings.sentenceLength] ?? '보통 응답',
    personality,
  }
}

function createUpdatePayload(selected) {
  const lengthMap = {
    '짧은 응답': 'SHORT',
    '보통 응답': 'MEDIUM',
    '자세한 응답': 'LONG',
  }

  return {
    speechLevel: selected.speech === '반말' ? 'BANMAL' : 'JONDAEMAL',
    sentenceLength: lengthMap[selected.length] ?? 'MEDIUM',
    ...PERSONALITY_SETTINGS[selected.personality],
  }
}

function getKakaoStatusText(status) {
  const statusText = {
    UPLOADED: '카카오톡 파일 확인 중...',
    WAITING_PARTICIPANT_SELECTION: '대화 참여자 확인 중...',
    PREPROCESSING: '카카오톡 대화 정리 중...',
    ANALYZING: '말투 분석 중...',
    GENERATING_DIALOGUES: '아바타 대사 생성 중...',
    COMPLETED: '말투 설정 완료',
  }

  return statusText[status] ?? '말투 분석 중...'
}

function wait(milliseconds) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds)
  })
}

function selectParticipant(participants) {
  if (participants.length === 1) {
    return participants[0]
  }

  const participantList = participants
    .map((participant, index) => `${index + 1}. ${participant.displayName}`)
    .join('\n')

  const answer = window.prompt(`카카오톡 대화에서 본인을 선택해 주세요.\n\n${participantList}`, '1')

  if (answer === null) {
    return null
  }

  const selectedIndex = Number(answer) - 1

  if (
    !Number.isInteger(selectedIndex) ||
    selectedIndex < 0 ||
    selectedIndex >= participants.length
  ) {
    alert('올바른 번호를 입력해 주세요.')
    return null
  }

  return participants[selectedIndex]
}

async function waitForKakaoAnalysis({ jobId, firstPollAfterMs, cancelledRef, onStatusChange }) {
  let pollAfterMs = Math.max(Number(firstPollAfterMs) || 2000, 1000)

  while (!cancelledRef.current) {
    await wait(pollAfterMs)

    if (cancelledRef.current) {
      return null
    }

    const response = await getKakaoSpeechStyleJob(jobId)

    const job = getResponseData(response)
    const status = job?.status

    if (cancelledRef.current) {
      return null
    }

    onStatusChange(status)

    if (status === 'COMPLETED') {
      return job
    }

    if (status === 'FAILED') {
      throw new Error(job?.message ?? '카카오톡 말투 분석에 실패했습니다.')
    }

    if (status === 'EXPIRED') {
      throw new Error('카카오톡 분석 시간이 만료되었습니다.')
    }

    pollAfterMs = Math.max(Number(job?.pollAfterMs) || 2000, 1000)
  }

  return null
}

function SettingPage() {
  const navigate = useNavigate()

  const [selected, setSelected] = useState(DEFAULT_SELECTED)

  const [avatarImageUrl, setAvatarImageUrl] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [isKakaoProcessing, setIsKakaoProcessing] = useState(false)

  const [kakaoStatusText, setKakaoStatusText] = useState('')

  const selectedRef = useRef(DEFAULT_SELECTED)
  const saveTimerRef = useRef(null)
  const pendingSettingsRef = useRef(null)
  const isSavingRef = useRef(false)

  const kakaoFileInputRef = useRef(null)
  const kakaoCancelledRef = useRef(false)

  useEffect(() => {
    let objectUrl = ''
    let isCancelled = false

    const loadAvatarImage = async () => {
      try {
        const imageBlob = await getAvatarImage()

        if (isCancelled) return

        objectUrl = URL.createObjectURL(imageBlob)

        setAvatarImageUrl(objectUrl)
      } catch (error) {
        console.error('아바타 이미지를 불러오지 못했습니다.', error)
      }
    }

    loadAvatarImage()

    return () => {
      isCancelled = true

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [])

  useEffect(() => {
    let isCancelled = false

    const loadSpeechStyle = async () => {
      setIsLoading(true)

      try {
        const response = await getSpeechStyle()

        if (isCancelled) return

        const result = getResponseData(response)
        const settings = result?.settings

        if (settings) {
          const nextSelected = getSelectedSettings(settings)

          selectedRef.current = nextSelected
          setSelected(nextSelected)
        }
      } catch (error) {
        console.error('말투 설정을 불러오지 못했습니다.', error)
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadSpeechStyle()

    return () => {
      isCancelled = true
    }
  }, [])

  const savePendingSettings = async () => {
    if (isSavingRef.current || !pendingSettingsRef.current) {
      return
    }

    const settingsToSave = pendingSettingsRef.current

    pendingSettingsRef.current = null
    isSavingRef.current = true
    setIsSaving(true)

    try {
      await updateSpeechStyle(createUpdatePayload(settingsToSave))
    } catch (error) {
      console.error('말투 설정을 저장하지 못했습니다.', error)

      alert(error.message ?? '말투 설정을 저장하지 못했습니다.')
    } finally {
      isSavingRef.current = false

      if (pendingSettingsRef.current) {
        if (saveTimerRef.current === null) {
          saveTimerRef.current = window.setTimeout(() => {
            saveTimerRef.current = null
            savePendingSettings()
          }, 0)
        }
      } else {
        setIsSaving(false)
      }
    }
  }

  const scheduleSave = (nextSelected) => {
    pendingSettingsRef.current = nextSelected

    window.clearTimeout(saveTimerRef.current)

    saveTimerRef.current = window.setTimeout(() => {
      saveTimerRef.current = null
      savePendingSettings()
    }, 2000)
  }

  useEffect(() => {
    return () => {
      window.clearTimeout(saveTimerRef.current)
      kakaoCancelledRef.current = true
    }
  }, [])

  const handleSelect = (category, value) => {
    if (isLoading || isKakaoProcessing || selectedRef.current[category] === value) {
      return
    }

    const nextSelected = {
      ...selectedRef.current,
      [category]: value,
    }

    selectedRef.current = nextSelected
    setSelected(nextSelected)
    scheduleSave(nextSelected)
  }

  const handleKakaoButtonClick = () => {
    if (isLoading || isSaving || isKakaoProcessing) {
      return
    }

    window.clearTimeout(saveTimerRef.current)

    saveTimerRef.current = null
    pendingSettingsRef.current = null

    kakaoFileInputRef.current?.click()
  }

  const handleKakaoFileChange = async (event) => {
    const file = event.target.files?.[0]

    event.target.value = ''

    if (!file) {
      return
    }

    if (!file.name.toLowerCase().endsWith('.zip')) {
      alert('카카오톡 대화 ZIP 파일을 선택해 주세요.')
      return
    }

    kakaoCancelledRef.current = false
    setIsKakaoProcessing(true)
    setKakaoStatusText('카카오톡 파일 업로드 중...')

    try {
      const uploadResponse = await createKakaoSpeechStyleJob(file)

      const uploadResult = getResponseData(uploadResponse)

      const jobId = uploadResult?.jobId
      const participants = uploadResult?.participants ?? []

      if (!jobId) {
        throw new Error('카카오톡 분석 작업을 생성하지 못했습니다.')
      }

      if (participants.length === 0) {
        throw new Error('카카오톡 대화 참여자를 찾지 못했습니다.')
      }

      setKakaoStatusText('카카오톡에서 본인을 선택해 주세요.')

      const participant = selectParticipant(participants)

      if (!participant) {
        return
      }

      setKakaoStatusText('말투 분석을 준비 중...')

      const analyzeResponse = await analyzeKakaoSpeechStyleJob(jobId, participant.id)

      const analyzeResult = getResponseData(analyzeResponse)

      const completedJob = await waitForKakaoAnalysis({
        jobId,
        firstPollAfterMs: analyzeResult?.pollAfterMs ?? 2000,
        cancelledRef: kakaoCancelledRef,
        onStatusChange: (status) => {
          setKakaoStatusText(getKakaoStatusText(status))
        },
      })

      if (!completedJob || kakaoCancelledRef.current) {
        return
      }

      const styleResponse = await getSpeechStyle()

      const styleResult = getResponseData(styleResponse)

      const settings = styleResult?.settings

      if (settings) {
        const nextSelected = getSelectedSettings(settings)

        selectedRef.current = nextSelected
        setSelected(nextSelected)
      }

      setKakaoStatusText('말투 설정 완료')

      alert('카카오톡 말투가 아바타에 적용되었습니다.')
    } catch (error) {
      if (kakaoCancelledRef.current) {
        return
      }

      console.error('카카오톡 말투 설정에 실패했습니다.', error)

      alert(error.message ?? '카카오톡 말투 설정에 실패했습니다.')
    } finally {
      if (!kakaoCancelledRef.current) {
        setIsKakaoProcessing(false)
        setKakaoStatusText('')
      }
    }
  }

  return (
    <div className='set__container'>
      <div className='set__header'>
        <Icon
          name='back-arrow'
          width={8}
          height={16}
          className='set__header--back'
          onClick={() => navigate(-1)}
        />

        <div className='set__header--title'>아바타 설정</div>
      </div>

      <div className='set__content'>
        <div className='set__myavatar'>
          <div className='set__content--title'>나의 현재 아바타</div>

          <img
            src={avatarImageUrl || dummyProflie}
            className='set__myavatar--image'
            alt='나의 현재 아바타'
          />
        </div>

        <div className='set__response'>
          <div className='set__content--title'>아바타 응답 선택</div>

          <div className='set__options' aria-busy={isSaving || isKakaoProcessing}>
            <div className='set__option--group'>
              <button
                type='button'
                className={`set__option--opt ${selected.speech === '반말' ? 'selected' : ''}`}
                disabled={isLoading || isKakaoProcessing}
                onClick={() => handleSelect('speech', '반말')}
              >
                반말
              </button>

              <button
                type='button'
                className={`set__option--opt ${selected.speech === '존댓말' ? 'selected' : ''}`}
                disabled={isLoading || isKakaoProcessing}
                onClick={() => handleSelect('speech', '존댓말')}
              >
                존댓말
              </button>
            </div>

            <div className='set__option--group'>
              <button
                type='button'
                className={`set__option--opt ${selected.length === '짧은 응답' ? 'selected' : ''}`}
                disabled={isLoading || isKakaoProcessing}
                onClick={() => handleSelect('length', '짧은 응답')}
              >
                짧은 응답
              </button>

              <button
                type='button'
                className={`set__option--opt ${selected.length === '보통 응답' ? 'selected' : ''}`}
                disabled={isLoading || isKakaoProcessing}
                onClick={() => handleSelect('length', '보통 응답')}
              >
                보통 응답
              </button>

              <button
                type='button'
                className={`set__option--opt ${
                  selected.length === '자세한 응답' ? 'selected' : ''
                }`}
                disabled={isLoading || isKakaoProcessing}
                onClick={() => handleSelect('length', '자세한 응답')}
              >
                자세한 응답
              </button>
            </div>

            <div className='set__option--group'>
              <button
                type='button'
                className={`set__option--opt ${
                  selected.personality === '다정함' ? 'selected' : ''
                }`}
                disabled={isLoading || isKakaoProcessing}
                onClick={() => handleSelect('personality', '다정함')}
              >
                다정함
              </button>

              <button
                type='button'
                className={`set__option--opt ${
                  selected.personality === '까칠함' ? 'selected' : ''
                }`}
                disabled={isLoading || isKakaoProcessing}
                onClick={() => handleSelect('personality', '까칠함')}
              >
                까칠함
              </button>

              <button
                type='button'
                className={`set__option--opt ${
                  selected.personality === '장난스러움' ? 'selected' : ''
                }`}
                disabled={isLoading || isKakaoProcessing}
                onClick={() => handleSelect('personality', '장난스러움')}
              >
                장난스러움
              </button>
            </div>
          </div>
        </div>

        <input
          ref={kakaoFileInputRef}
          type='file'
          className='set__kakao-input'
          accept='.zip,application/zip'
          onChange={handleKakaoFileChange}
        />

        <button
          type='button'
          className='set__kakao'
          disabled={isLoading || isSaving || isKakaoProcessing}
          onClick={handleKakaoButtonClick}
        >
          {isKakaoProcessing ? kakaoStatusText : '카카오톡으로 설정하기'}
        </button>
      </div>
    </div>
  )
}

export default SettingPage
