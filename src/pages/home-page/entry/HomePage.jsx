import { useEffect, useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import './HomePage.css'

import { getAvatarImage, selectAvatarDialogue } from '../../../api/avatarApi'
import { getDailyRoutines, getHome } from '../../../api/homeApi'
import {
  getRoutineRecommendations,
  ROUTINE_RECOMMENDATION_CATEGORIES,
} from '../../../api/routineApi'
import { getCurrentUser } from '../../../api/userApi'

import ChatBubble from '../../../components/chat-bubble/ChatBubble'
import HomeBottomSheet from '../component/bottom-sheet/HomeBottomSheet'

import dummy from '../../../assets/avatar/avatar-default/dummy.png'

import {
  createRecommendedRoutineCardData,
  createRoutineCardData,
  createTodoCardData,
} from '../component/bottom-sheet/homeBottomSheetData'

function getDialogueSituation(routines, progress, achievementData) {
  const isAllCompleted = progress.totalCount > 0 && progress.completedCount === progress.totalCount

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

  if (achievementData.streak > 0) {
    return 'STREAK_CONTINUED'
  }

  return 'RETURN_AFTER_ABSENCE'
}

function getRecommendationArray(response) {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data

  return []
}

function HomePage() {
  const { openRoutinePlus, isRoutinePlusOpen, homeRefreshKey } = useOutletContext()

  const [sheetProgress, setSheetProgress] = useState(0)
  const [isChatVisible, setIsChatVisible] = useState(false)
  const [isDialogueLoading, setIsDialogueLoading] = useState(false)
  const [chatContent, setChatContent] = useState('')

  const [nickname, setNickname] = useState('')
  const [avatarImageUrl, setAvatarImageUrl] = useState('')

  const [routines, setRoutines] = useState([])
  const [todos, setTodos] = useState([])
  const [recommendedRoutines, setRecommendedRoutines] = useState([])

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
  }, [homeRefreshKey])

  useEffect(() => {
    let isMounted = true

    const loadRecommendedRoutines = async () => {
      try {
        const recommendationGroups = await Promise.all(
          ROUTINE_RECOMMENDATION_CATEGORIES.map((category) => getRoutineRecommendations(category)),
        )

        if (!isMounted) return

        const recommendations = recommendationGroups.flatMap((group) =>
          getRecommendationArray(group).slice(0, 1),
        )

        setRecommendedRoutines(recommendations.map(createRecommendedRoutineCardData))
      } catch (error) {
        console.error('추천 루틴을 불러오지 못했습니다.', error)

        if (isMounted) {
          setRecommendedRoutines([])
        }
      }
    }

    loadRecommendedRoutines()

    return () => {
      isMounted = false
    }
  }, [homeRefreshKey])

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
    return () => {
      if (chatTimerRef.current) {
        clearTimeout(chatTimerRef.current)
      }
    }
  }, [])

  const handleAvatarClick = async () => {
    if (isDialogueLoading) return

    if (chatTimerRef.current) {
      clearTimeout(chatTimerRef.current)
    }

    setIsDialogueLoading(true)

    let message = '오늘도 같이 해볼까요?'

    try {
      const situation = getDialogueSituation(routines, progress, achievementData)

      const dialogue = await selectAvatarDialogue(situation)

      if (dialogue?.content) {
        message = dialogue.content
      }
    } catch (error) {
      console.error('아바타 대사를 불러오지 못했습니다.', error)
    } finally {
      setChatContent(message)
      setIsChatVisible(true)
      setIsDialogueLoading(false)

      chatTimerRef.current = setTimeout(() => {
        setIsChatVisible(false)
      }, 2000)
    }
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
          aria-busy={isDialogueLoading}
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
        recommendedRoutines={recommendedRoutines}
        isRoutinePlusOpen={isRoutinePlusOpen}
        onRecommendedRoutineAdd={openRoutinePlus}
        onRoutineEdit={openRoutinePlus}
        onDragProgress={setSheetProgress}
      />
    </div>
  )
}

export default HomePage
