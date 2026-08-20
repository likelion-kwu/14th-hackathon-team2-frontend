import { useEffect, useRef, useState } from 'react'

import './HomePage.css'

import { getHome, getDailyRoutines } from '../../../api/homeApi'
import { getCurrentUser } from '../../../api/userApi'

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

        const homeRoutineMap = new Map(
          home.routines.map((routine) => [routine.dailyRoutineId, routine]),
        )

        const regularRoutines = []
        const todoRoutines = []

        dailyRoutineData.routines.forEach((dailyRoutine) => {
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
          completedCount: home.progress.completedCount,
          totalCount: home.progress.totalCount,
        })

        setAchievementData({
          streak: home.success.currentStreakDays,
          completedDays: Math.min(home.success.currentStreakDays, 7),
        })
      } catch (error) {
        console.error(error)

        alert(error.message ?? '홈 정보를 불러오지 못했습니다.')
      }
    }

    loadHomeData()

    return () => {
      isMounted = false

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
          src={dummy}
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
