import { useEffect, useRef, useState } from 'react'

import Episode from '../../episode-popup/Episode'

import BottomSheetHeader from './bottom-sheet-header/BottomSheetHeader'
import PointToast from './point-toast/PointToast'
import RecommendedRoutine from './recommended-routine/RecommendedRoutine'
import RoutineCard from './routine-card/RoutineCard'
import RoutineTimeline from './routine-timeline/RoutineTimeline'
import TodoSection from './todo-section/TodoSection'

import { RECOMMENDED_ROUTINES, TIMELINE_IMAGES } from './homeBottomSheetData'

import './HomeBottomSheet.css'

function HomeBottomSheet({ onDragProgress, achievementData, routines = [], todos = [], progress }) {
  const [sheetState, setSheetState] = useState('closed')
  const [dragY, setDragY] = useState(null)
  const [pointToast, setPointToast] = useState(null)
  const [isEpisodeOpen, setIsEpisodeOpen] = useState(false)
  const [isAchievementOpen, setIsAchievementOpen] = useState(false)

  const startYRef = useRef(0)
  const startTranslateRef = useRef(0)
  const draggingRef = useRef(false)
  const pointToastTimerRef = useRef(null)

  const screenHeight = window.innerHeight

  const SNAP = {
    open: 0,
    middle: screenHeight * 0.3,
    closed: screenHeight * 0.65,
  }

  useEffect(() => {
    return () => {
      window.clearTimeout(pointToastTimerRef.current)
    }
  }, [])

  const getCurrentTranslate = () => {
    if (dragY !== null) return dragY

    return SNAP[sheetState]
  }

  const getProgress = (translateY) => {
    return Math.max(0, Math.min(1, (SNAP.closed - translateY) / (SNAP.closed - SNAP.middle)))
  }

  const handlePointerDown = (event) => {
    draggingRef.current = true
    startYRef.current = event.clientY
    startTranslateRef.current = getCurrentTranslate()

    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event) => {
    if (!draggingRef.current) return

    const diff = event.clientY - startYRef.current

    const nextY = Math.max(SNAP.open, Math.min(startTranslateRef.current + diff, SNAP.closed))

    setDragY(nextY)
    onDragProgress?.(getProgress(nextY))
  }

  const handlePointerUp = () => {
    if (!draggingRef.current) return

    draggingRef.current = false

    const currentY = getCurrentTranslate()

    const [nextState, nextY] = Object.entries(SNAP).reduce((nearest, current) => {
      const [, nearestY] = nearest
      const [, currentSnapY] = current

      return Math.abs(currentY - currentSnapY) < Math.abs(currentY - nearestY) ? current : nearest
    })

    setSheetState(nextState)
    setDragY(null)

    onDragProgress?.(getProgress(nextY))
  }

  const handleReceivePoint = (point) => {
    window.clearTimeout(pointToastTimerRef.current)

    setPointToast({
      id: Date.now(),
      point,
    })

    pointToastTimerRef.current = window.setTimeout(() => {
      setPointToast(null)
    }, 2000)
  }

  const currentTranslate = getCurrentTranslate()
  const recommendationProgress = getProgress(currentTranslate)

  const completedTodoCount = todos.filter((todo) => todo.isCompleted).length

  const isPopupOpen = isEpisodeOpen || isAchievementOpen

  return (
    <div
      className={`bottom-sheet bottom-sheet--${sheetState} ${dragY !== null ? 'dragging' : ''}`}
      style={{
        transform: `translateY(${currentTranslate}px)`,
        '--fixed-layer-offset-y': `${-currentTranslate}px`,
        '--recommendation-opacity': isPopupOpen ? 0 : recommendationProgress,
      }}
    >
      <div
        className='bottom-sheet__drag-area'
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className='bottom-sheet__handle' />
      </div>

      <BottomSheetHeader
        totalCount={progress?.totalCount ?? 0}
        completedCount={progress?.completedCount ?? 0}
        achievementData={achievementData}
        onAchievementOpenChange={setIsAchievementOpen}
        onStoryClick={() => setIsEpisodeOpen(true)}
      />

      <div className='bottomSheet__content'>
        <section className='bottomSheet__routine-section'>
          <RoutineTimeline sunImage={TIMELINE_IMAGES.sun} moonImage={TIMELINE_IMAGES.moon} />

          <div className='routineList'>
            {routines.map((routine) => (
              <RoutineCard key={routine.id} routine={routine} onReceivePoint={handleReceivePoint} />
            ))}
          </div>
        </section>

        <TodoSection
          todos={todos}
          completedCount={completedTodoCount}
          onReceivePoint={handleReceivePoint}
        />
      </div>

      <div className='recommendedRoutineBackdrop' aria-hidden='true' />

      <RecommendedRoutine
        routines={RECOMMENDED_ROUTINES}
        progress={isPopupOpen ? 0 : recommendationProgress}
      />

      {pointToast && <PointToast key={pointToast.id} point={pointToast.point} />}

      {isEpisodeOpen && <Episode onClose={() => setIsEpisodeOpen(false)} />}
    </div>
  )
}

export default HomeBottomSheet
