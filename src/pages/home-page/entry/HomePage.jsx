import { useEffect, useRef, useState } from 'react'

import './HomePage.css'

import { getHome, getDailyRoutines } from '../../../api/homeApi'
import { getCurrentUser } from '../../../api/userApi'
import { getAvatarImage } from '../../../api/avatarApi'

import ChatBubble from '../../../components/chat-bubble/ChatBubble'
import HomeBottomSheet from '../component/bottom-sheet/HomeBottomSheet'

import dummy from '../../../assets/avatar/avatar-default/dummy.png'

import {
  createRoutineCardData,
  createTodoCardData,
} from '../component/bottom-sheet/homeBottomSheetData'

function HomePage() {
  const [sheetProgress, setSheetProgress] = useState(0)
  const [isChatVisible, setIsChatVisible] = useState(false)
  const [chatContent, setChatContent] = useState('')

  const [nickname, setNickname] = useState('')
  const [avatarImageUrl, setAvatarImageUrl] = useState('')

  const [routines, setRoutines] = useState([])
  const [todos, setTodos] = useState([])

  const [progress, setProgress] = useState({
    completedCount: 0,
    totalCount: 0,
  })

  const [achievementData, setAchievementData] = useState({
    streak: 0,
    completedDays: 0,
  })

  const chatTimerRef = useRef(null)

  const avatarHeight = 400 - sheetProgress * 100
  const avatarTranslateY = -sheetProgress * 30

  // 홈 기본 정보 불러오기
  useEffect(() => {
    let isMounted = true

    const loadHomeData = async () => {
      try {
        const [user, home, dailyRoutineData] = await Promise.all([
          getCurrentUser(),
          getHome(),
          getDailyRoutines(),
        ])

        if (!isMounted) return

        const homeRoutines = home.routines ?? []
        const dailyRoutines = dailyRoutineData.routines ?? []

        const homeRoutineMap = new Map(
          homeRoutines.map((routine) => [routine.dailyRoutineId, routine]),
        )

        const regularRoutines = []
        const todoRoutines = []

        dailyRoutines.forEach((dailyRoutine) => {
          if (dailyRoutine.category === 'TO_DO') {
            todoRoutines.push(createTodoCardData(dailyRoutine))
            return
          }

          regularRoutines.push(
            createRoutineCardData(dailyRoutine, homeRoutineMap.get(dailyRoutine.id)),
          )
        })

        setNickname(user.nickname ?? '')
        setRoutines(regularRoutines)
        setTodos(todoRoutines)

        setProgress({
          completedCount: home.progress?.completedCount ?? 0,
          totalCount: home.progress?.totalCount ?? 0,
        })

        setAchievementData({
          streak: home.success?.currentStreakDays ?? 0,
          completedDays: Math.min(home.success?.currentStreakDays ?? 0, 7),
        })
      } catch (error) {
        console.error(error)
        alert(error.message ?? '홈 정보를 불러오지 못했습니다.')
      }
    }

    loadHomeData()

    return () => {
      isMounted = false
    }
  }, [])

  // 실제 아바타 이미지 불러오기
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

  // 페이지를 나갈 때 채팅 타이머 정리
  useEffect(() => {
    return () => {
      if (chatTimerRef.current) {
        clearTimeout(chatTimerRef.current)
      }
    }
  }, [])

  const dummyMessages = [
    '오늘도 같이 해볼까요?',
    '조금만 더 힘내봐요!',
    '오늘 루틴도 기다리고 있어요.',
    '꾸준히 하고 있는 거 멋져요!',
    '저도 점점 건강해지는 것 같아요.',
  ]

  const handleAvatarClick = () => {
    const randomIndex = Math.floor(Math.random() * dummyMessages.length)

    setChatContent(dummyMessages[randomIndex])
    setIsChatVisible(true)

    if (chatTimerRef.current) {
      clearTimeout(chatTimerRef.current)
    }

    chatTimerRef.current = setTimeout(() => {
      setIsChatVisible(false)
    }, 2000)
  }

  return (
    <div className='home__container'>
      <div
        className='home__title'
        style={{
          opacity: 1 - sheetProgress,
          maxHeight: `${40 * (1 - sheetProgress)}px`,
        }}
      >
        반가워요, {nickname || '--'}님
      </div>

      <div
        className='home__avatar__container'
        style={{
          transform: `translateY(${avatarTranslateY}px)`,
        }}
      >
        <img
          src={avatarImageUrl || dummy}
          className='home__avatar'
          alt='내 아바타'
          onClick={handleAvatarClick}
          style={{
            height: `${avatarHeight}px`,
          }}
        />

        {isChatVisible && <ChatBubble content={chatContent} />}
      </div>

      <HomeBottomSheet
        routines={routines}
        todos={todos}
        progress={progress}
        achievementData={achievementData}
        onDragProgress={setSheetProgress}
      />
    </div>
  )
}

export default HomePage
