import { useEffect, useMemo, useRef, useState } from 'react'

import Episode from '../../episode-popup/Episode'

import BottomSheetHeader from './bottom-sheet-header/BottomSheetHeader'
import PointToast from './point-toast/PointToast'
import RecommendedRoutine from './recommended-routine/RecommendedRoutine'
import RoutineCard from './routine-card/RoutineCard'
import RoutineTimeline from './routine-timeline/RoutineTimeline'
import TodoSection from './todo-section/TodoSection'

import { TIMELINE_IMAGES } from './homeBottomSheetData'
import { createRoutineTimelineLayout } from './routineTimelineLayout'

import './HomeBottomSheet.css'

function HomeBottomSheet({
  onDragProgress,
  achievementData,
  routines = [],
  todos = [],
  progress,
  recommendedRoutines = [],
  onRecommendedRoutineAdd,
  onRoutineEdit,
  isRoutinePlusOpen = false,
}) {
  const [sheetState, setSheetState] = useState('closed')
  const [dragY, setDragY] = useState(null)
  const [pointToast, setPointToast] = useState(null)
  const [isEpisodeOpen, setIsEpisodeOpen] = useState(false)
  const [isAchievementOpen, setIsAchievementOpen] = useState(false)
  const [isContentScrolled, setIsContentScrolled] = useState(false)

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

  const timelineLayout = useMemo(() => {
    return createRoutineTimelineLayout(routines)
  }, [routines])

  useEffect(() => {
    return () => {
      window.clearTimeout(pointToastTimerRef.current)
    }
  }, [])

  const getCurrentTranslate = () => {
    if (dragY !== null) {
      return dragY
    }

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
    if (!draggingRef.current) {
      return
    }

    const diff = event.clientY - startYRef.current

    const nextY = Math.max(SNAP.open, Math.min(startTranslateRef.current + diff, SNAP.closed))

    setDragY(nextY)
    onDragProgress?.(getProgress(nextY))
  }

  const handlePointerUp = () => {
    if (!draggingRef.current) {
      return
    }

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

  const handleContentScroll = (event) => {
    const scrollTop = event.currentTarget.scrollTop

    setIsContentScrolled(scrollTop > 20)
  }

  const currentTranslate = getCurrentTranslate()
  const recommendationProgress = getProgress(currentTranslate)

  const completedTodoCount = todos.filter((todo) => todo.isCompleted).length

  const isPopupOpen = isEpisodeOpen || isAchievementOpen || isRoutinePlusOpen

  const recommendationOpacity = isPopupOpen || isContentScrolled ? 0 : recommendationProgress

  return (
    <div
      className={`bottom-sheet bottom-sheet--${sheetState} ${dragY !== null ? 'dragging' : ''}`}
      style={{
        transform: `translateY(${currentTranslate}px)`,
        '--fixed-layer-offset-y': `${-currentTranslate}px`,
        '--recommendation-opacity': recommendationOpacity,
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

      <div className='bottomSheet__content' onScroll={handleContentScroll}>
        <section className='bottomSheet__routine-section'>
          <RoutineTimeline
            sunImage={TIMELINE_IMAGES.sun}
            moonImage={TIMELINE_IMAGES.moon}
            layout={timelineLayout}
          />

          <div
            className='routineList'
            style={{
              height: `${timelineLayout.height}px`,
            }}
          >
            {timelineLayout.positionedRoutines.map(({ routine, top }) => (
              <div
                key={routine.id}
                className='routineList__item'
                style={{
                  top: `${top}px`,
                }}
              >
                <RoutineCard
                  routine={routine}
                  onReceivePoint={handleReceivePoint}
                  onEdit={onRoutineEdit}
                />
              </div>
            ))}
          </div>
        </section>

        <TodoSection todos={todos} completedCount={completedTodoCount} onEdit={onRoutineEdit} />
      </div>

      {recommendedRoutines.length > 0 && (
        <>
          <div className='recommendedRoutineBackdrop' aria-hidden='true' />

          <RecommendedRoutine
            routines={recommendedRoutines}
            progress={recommendationOpacity}
            onAddRoutine={onRecommendedRoutineAdd}
          />
        </>
      )}

      {pointToast && <PointToast key={pointToast.id} point={pointToast.point} />}

      {isEpisodeOpen && <Episode onClose={() => setIsEpisodeOpen(false)} />}
    </div>
  )
}

export default HomeBottomSheet
