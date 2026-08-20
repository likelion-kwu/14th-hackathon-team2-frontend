import { useEffect, useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import './HomePage.css'

import { getAvatarImage, selectAvatarDialogue } from '../../../api/avatarApi'
import { getDailyRoutines, getHome } from '../../../api/homeApi'
import {
  getRoutineRecommendations,
  ROUTINE_RECOMMENDATION_CATEGORIES,
} from '../../../api/routineApi'
import { getStories } from '../../../api/storyApi'
import { getCurrentUser } from '../../../api/userApi'

import ChatBubble from '../../../components/chat-bubble/ChatBubble'
import HomeBottomSheet from '../component/bottom-sheet/HomeBottomSheet'
import StoryUnlockPopup from '../component/story-unlock-popup/StoryUnlockPopup'

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

/* 사용자별 스토리 팝업 확인 기록 key */
function getStoryStorageKey(userId) {
  return `seen-story-unlocks-${userId}`
}

/* 이미 확인한 에피소드 번호 가져오기 */
function getSeenStoryEpisodes(userId) {
  if (!userId) return []

  try {
    const savedValue = localStorage.getItem(getStoryStorageKey(userId))

    if (!savedValue) return []

    const parsedValue = JSON.parse(savedValue)

    return Array.isArray(parsedValue) ? parsedValue : []
  } catch {
    return []
  }
}

/* 팝업을 확인한 에피소드 저장 */
function saveSeenStoryEpisode(userId, episodeNumber) {
  if (!userId) return

  const seenEpisodes = getSeenStoryEpisodes(userId)

  if (seenEpisodes.includes(episodeNumber)) {
    return
  }

  localStorage.setItem(getStoryStorageKey(userId), JSON.stringify([...seenEpisodes, episodeNumber]))
}

function HomePage() {
  const {
    openRoutinePlus,
    isRoutinePlusOpen,
    homeRefreshKey,
    deletedRoutineIds = [],
  } = useOutletContext()

  const [sheetProgress, setSheetProgress] = useState(0)
  const [isChatVisible, setIsChatVisible] = useState(false)
  const [isDialogueLoading, setIsDialogueLoading] = useState(false)
  const [chatContent, setChatContent] = useState('')

  const [userId, setUserId] = useState(null)
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

  const [unlockedStoryEpisode, setUnlockedStoryEpisode] = useState(null)

  const chatTimerRef = useRef(null)

  const avatarHeight = 400 - sheetProgress * 100
  const avatarTranslateY = -sheetProgress * 30

  useEffect(() => {
    let isMounted = true

    const loadHomeData = async () => {
      try {
        const [user, home, dailyRoutineData, storyData] = await Promise.all([
          getCurrentUser(),
          getHome(),
          getDailyRoutines(),
          getStories(),
        ])

        if (!isMounted) return

        const homeRoutines = home.routines ?? []
        const dailyRoutines = dailyRoutineData.routines ?? []

        const deletedRoutineIdSet = new Set(deletedRoutineIds.map((routineId) => String(routineId)))

        const hiddenRegularRoutines = dailyRoutines.filter((dailyRoutine) => {
          return (
            dailyRoutine.category !== 'TO_DO' &&
            deletedRoutineIdSet.has(String(dailyRoutine.routineId))
          )
        })

        const homeRoutineMap = new Map(
          homeRoutines.map((routine) => [routine.dailyRoutineId, routine]),
        )

        const regularRoutines = []
        const todoRoutines = []

        dailyRoutines.forEach((dailyRoutine) => {
          if (deletedRoutineIdSet.has(String(dailyRoutine.routineId))) {
            return
          }

          if (dailyRoutine.category === 'TO_DO') {
            todoRoutines.push(createTodoCardData(dailyRoutine, dailyRoutineData.serviceDate))

            return
          }

          regularRoutines.push(
            createRoutineCardData(dailyRoutine, homeRoutineMap.get(dailyRoutine.id)),
          )
        })

        setUserId(user.id)
        setNickname(user.nickname ?? '')
        setRoutines(regularRoutines)
        setTodos(todoRoutines)

        setProgress({
          completedCount: Math.max(
            0,
            (home.progress?.completedCount ?? 0) -
              hiddenRegularRoutines.filter((routine) => routine.status === 'COMPLETED').length,
          ),
          totalCount: Math.max(0, (home.progress?.totalCount ?? 0) - hiddenRegularRoutines.length),
        })

        setAchievementData({
          streak: home.success?.currentStreakDays ?? 0,
          completedDays: Math.min(home.success?.currentStreakDays ?? 0, 7),
        })

        /*
         * 서버에서 unlocked=true인 에피소드 중
         * 아직 팝업을 확인하지 않은 에피소드를 찾는다.
         */
        const episodes = storyData?.episodes ?? []

        const seenEpisodes = getSeenStoryEpisodes(user.id)

        const unseenUnlockedEpisodes = episodes
          .filter((episode) => episode.unlocked && !seenEpisodes.includes(episode.episodeNumber))
          .sort((first, second) => first.episodeNumber - second.episodeNumber)

        /*
         * 여러 개가 존재하면 가장 최근에 해금된
         * 번호가 큰 에피소드를 우선 표시
         */
        if (unseenUnlockedEpisodes.length > 0) {
          setUnlockedStoryEpisode(unseenUnlockedEpisodes[unseenUnlockedEpisodes.length - 1])
        } else {
          setUnlockedStoryEpisode(null)
        }
      } catch (error) {
        console.error(error)

        alert(error.message ?? '홈 정보를 불러오지 못했습니다.')
      }
    }

    loadHomeData()

    return () => {
      isMounted = false
    }
  }, [deletedRoutineIds, homeRefreshKey])

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

  /*
   * X 버튼
   *
   * 팝업을 닫아도 사용자가 이미 확인한 것으로 처리해서
   * 다음 홈 진입 때 다시 뜨지 않도록 한다.
   */
  const handleStoryUnlockClose = () => {
    if (!unlockedStoryEpisode) return

    saveSeenStoryEpisode(userId, unlockedStoryEpisode.episodeNumber)

    setUnlockedStoryEpisode(null)
  }

  /*
   * 스토리 보기
   *
   * EpisodePage로 이동하기 전에
   * 팝업 확인 완료 상태를 저장한다.
   */
  const handleStoryUnlockView = () => {
    if (!unlockedStoryEpisode) return

    saveSeenStoryEpisode(userId, unlockedStoryEpisode.episodeNumber)

    setUnlockedStoryEpisode(null)
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

      {unlockedStoryEpisode && (
        <StoryUnlockPopup
          episode={unlockedStoryEpisode}
          onClose={handleStoryUnlockClose}
          onView={handleStoryUnlockView}
        />
      )}
    </div>
  )
}

export default HomePage
