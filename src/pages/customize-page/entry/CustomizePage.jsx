import { useEffect, useState } from 'react'

import './CustomizePage.css'

import { getAvatarImage, selectAvatarDialogue } from '../../../api/avatarApi'
import { getHome } from '../../../api/homeApi'

import ChatBubble from '../../../components/chat-bubble/ChatBubble'

import dummy from '../../../assets/avatar/avatar-default/dummy.png'

import CatalogBottomSheet from '../component/bottom-sheet/CatalogBottomSheet'

function getDialogueSituation(home) {
  const routines = home?.routines ?? []

  const completedCount = home?.progress?.completedCount ?? 0

  const totalCount = home?.progress?.totalCount ?? 0

  const currentStreakDays = home?.success?.currentStreakDays ?? 0

  const isAllCompleted = totalCount > 0 && completedCount === totalCount

  if (isAllCompleted) {
    return 'ALL_COMPLETED'
  }

  if (routines.some((routine) => routine.status === 'AVAILABLE')) {
    return 'ROUTINE_AVAILABLE'
  }

  if (routines.some((routine) => routine.status === 'UPCOMING')) {
    return 'ROUTINE_UPCOMING'
  }

  if (routines.some((routine) => routine.status === 'FAILED')) {
    return 'ROUTINE_REMINDER'
  }

  if (completedCount > 0) {
    return 'ROUTINE_COMPLETED'
  }

  if (currentStreakDays > 0) {
    return 'STREAK_CONTINUED'
  }

  return 'RETURN_AFTER_ABSENCE'
}

async function getSelectedAvatarDialogue() {
  const home = await getHome()

  const situation = getDialogueSituation(home)

  return selectAvatarDialogue(situation)
}

function CustomizePage() {
  const [sheetProgress, setSheetProgress] = useState(0)

  const [avatarImageUrl, setAvatarImageUrl] = useState('')

  const [chatContent, setChatContent] = useState('오늘도 같이 해볼까요?')

  const [isDialogueLoading, setIsDialogueLoading] = useState(false)

  const avatarHeight = 400 - sheetProgress * 100

  const avatarTranslateY = -sheetProgress * 30

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

    const loadAvatarDialogue = async () => {
      setIsDialogueLoading(true)

      try {
        const dialogue = await getSelectedAvatarDialogue()

        if (!isCancelled && dialogue?.content) {
          setChatContent(dialogue.content)
        }
      } catch (error) {
        console.error('아바타 대사를 불러오지 못했습니다.', error)
      } finally {
        if (!isCancelled) {
          setIsDialogueLoading(false)
        }
      }
    }

    loadAvatarDialogue()

    return () => {
      isCancelled = true
    }
  }, [])

  const handleAvatarClick = async () => {
    if (isDialogueLoading) return

    setIsDialogueLoading(true)

    try {
      const dialogue = await getSelectedAvatarDialogue()

      if (dialogue?.content) {
        setChatContent(dialogue.content)
      }
    } catch (error) {
      console.error('아바타 대사를 불러오지 못했습니다.', error)
    } finally {
      setIsDialogueLoading(false)
    }
  }

  return (
    <div className='custom__container'>
      <div
        className='custom__title'
        style={{
          opacity: 1 - sheetProgress,
          maxHeight: `${40 * (1 - sheetProgress)}px`,
        }}
      >
        커스터마이징
      </div>

      <div
        className='custom__avatar__container'
        style={{
          transform: `translateY(${avatarTranslateY}px)`,
        }}
      >
        <img
          src={avatarImageUrl || dummy}
          className='custom__avatar'
          alt='내 아바타'
          aria-busy={isDialogueLoading}
          onClick={handleAvatarClick}
          style={{
            height: `${avatarHeight}px`,
            cursor: isDialogueLoading ? 'wait' : 'pointer',
          }}
        />
      </div>

      <ChatBubble content={chatContent} />

      <CatalogBottomSheet onDragProgress={setSheetProgress} />
    </div>
  )
}

export default CustomizePage
