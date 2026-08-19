import { useEffect, useRef, useState } from 'react'

import { Icon } from '../../../../components/icon/Icon'

import imageDiet from '../../../../assets/home-bottom-sheet/character/image-diet.svg'
import imageHealth from '../../../../assets/home-bottom-sheet/character/image-health.svg'
import imageSkin from '../../../../assets/home-bottom-sheet/character/image-skin.svg'
import imageWellbeing from '../../../../assets/home-bottom-sheet/character/image-wellbeing.svg'
import imageMoon from '../../../../assets/home-bottom-sheet/image-moon.svg'
import imageSun from '../../../../assets/home-bottom-sheet/image-sun.svg'
import Episode from '../../episode-popup/Episode'

import './HomeBottomSheet.css'

const ROUTINES = [
  {
    id: 1,
    category: 'Skin',
    title: '텍스트',
    theme: 'skin',
    characterImage: imageSkin,
    isCompleted: false,
    rewardPoint: 5,
  },
  {
    id: 2,
    category: 'Well-being',
    title: '텍스트',
    theme: 'wellbeing',
    characterImage: imageWellbeing,
    isCompleted: false,
    rewardPoint: 5,
  },
  {
    id: 3,
    category: 'Diet',
    title: '텍스트',
    theme: 'diet',
    characterImage: imageDiet,
    isCompleted: false,
    rewardPoint: 10,
  },
  {
    id: 4,
    category: 'Skin',
    title: '텍스트',
    theme: 'skin',
    characterImage: imageSkin,
    isCompleted: false,
    rewardPoint: 5,
  },
  {
    id: 5,
    category: 'Health & Fit',
    title: '텍스트',
    theme: 'health',
    characterImage: imageHealth,
    isCompleted: false,
    rewardPoint: 10,
  },
]

const TODO_ROUTINES = [
  {
    id: 1,
    time: '00:00',
    title: '텍스트',
    isCompleted: false,
    rewardPoint: 5,
  },
  {
    id: 2,
    time: '시간 미지정',
    title: '텍스트',
    isCompleted: false,
    rewardPoint: 5,
  },
]

const RECOMMENDED_ROUTINES = [
  {
    id: 1,
    category: 'Skin',
    title: '텍스트',
    theme: 'skin',
    characterImage: imageSkin,
  },
  {
    id: 2,
    category: 'Well-being',
    title: '텍스트',
    theme: 'wellbeing',
    characterImage: imageWellbeing,
  },
  {
    id: 3,
    category: 'Diet',
    title: '텍스트',
    theme: 'diet',
    characterImage: imageDiet,
  },
  {
    id: 4,
    category: 'Health & Fit',
    title: '텍스트',
    theme: 'health',
    characterImage: imageHealth,
  },
]

function TimelineDots({ count, active = false }) {
  return (
    <div className={`routineTimeline__dots routineTimeline__dots--${count}`}>
      {Array.from({ length: count }).map((_, index) => (
        <span
          key={index}
          className={`routineTimeline__dot ${active ? 'routineTimeline__dot--active' : ''}`}
        />
      ))}
    </div>
  )
}

function RoutineTimeline() {
  return (
    <div className='routineTimeline'>
      <div className='routineTimeline__start'>
        <img src={imageSun} alt='' className='routineTimeline__sun' />
        <span className='routineTimeline__time'>06:00</span>
      </div>

      <TimelineDots count={4} active />

      <span className='routineTimeline__now'>Now</span>

      <TimelineDots count={4} active />

      <span className='routineTimeline__time'>12:00</span>

      <TimelineDots count={5} />

      <span className='routineTimeline__time'>15:00</span>

      <TimelineDots count={5} />

      <span className='routineTimeline__time'>18:00</span>

      <TimelineDots count={5} />

      <span className='routineTimeline__time'>21:00</span>

      <TimelineDots count={3} />

      <div className='routineTimeline__end'>
        <img src={imageMoon} alt='' className='routineTimeline__moon' />
        <span className='routineTimeline__time'>24:00</span>
      </div>
    </div>
  )
}

function RoutineCard({
  category,
  title,
  theme,
  characterImage,
  isCompleted,
  rewardPoint,
  onReceivePoint,
}) {
  return (
    <article
      className={`routineCard routineCard--${theme} ${isCompleted ? 'routineCard--completed' : ''}`}
    >
      <button
        type='button'
        className={`routineCard__check ${isCompleted ? 'routineCard__check--completed' : ''}`}
        aria-label={`${title} 완료 여부`}
      />

      <div className='routineCard__text'>
        <span className='routineCard__category'>{category}</span>
        <span className='routineCard__title'>{title}</span>
      </div>

      {isCompleted ? (
        <button
          type='button'
          className='routineCard__reward-button'
          onClick={() => onReceivePoint(rewardPoint)}
        >
          {rewardPoint}P 받기
        </button>
      ) : (
        <img src={characterImage} alt={`${category} 캐릭터`} className='routineCard__character' />
      )}
    </article>
  )
}

function TodoCard({ time, title, isCompleted, rewardPoint, onReceivePoint }) {
  return (
    <article className={`todoCard ${isCompleted ? 'todoCard--completed' : ''}`}>
      <button
        type='button'
        className={`todoCard__check ${isCompleted ? 'todoCard__check--completed' : ''}`}
        aria-label={`${title} 완료 여부`}
      />

      <div className='todoCard__text'>
        <span className='todoCard__time'>{time}</span>
        <span className='todoCard__title'>{title}</span>
      </div>

      {isCompleted && (
        <button
          type='button'
          className='todoCard__reward-button'
          onClick={() => onReceivePoint(rewardPoint)}
        >
          {rewardPoint}P 받기
        </button>
      )}
    </article>
  )
}

function RecommendedRoutineCard({ category, title, theme, characterImage }) {
  return (
    <article className={`recommendedRoutineCard recommendedRoutineCard--${theme}`}>
      <div className='recommendedRoutineCard__character-area'>
        <img
          src={characterImage}
          alt={`${category} 캐릭터`}
          className='recommendedRoutineCard__character'
          draggable='false'
        />
      </div>

      <div className='recommendedRoutineCard__text'>
        <span className='recommendedRoutineCard__category'>{category}</span>
        <span className='recommendedRoutineCard__title'>{title}</span>
      </div>

      <button
        type='button'
        className='recommendedRoutineCard__add-button'
        aria-label={`${category} 추천 루틴 추가`}
      >
        <span className='recommendedRoutineCard__add-icon'>+</span>
        <span>Add</span>
      </button>
    </article>
  )
}

function RecommendedRoutineList() {
  const listRef = useRef(null)
  const startXRef = useRef(0)
  const startScrollLeftRef = useRef(0)
  const draggingRef = useRef(false)

  const [isDragging, setIsDragging] = useState(false)

  const handlePointerDown = (event) => {
    if (event.pointerType !== 'mouse') return

    const list = listRef.current

    if (!list) return

    draggingRef.current = true
    startXRef.current = event.clientX
    startScrollLeftRef.current = list.scrollLeft

    setIsDragging(true)

    list.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event) => {
    if (!draggingRef.current) return

    const list = listRef.current

    if (!list) return

    const moveX = event.clientX - startXRef.current

    list.scrollLeft = startScrollLeftRef.current - moveX

    event.preventDefault()
  }

  const handlePointerUp = (event) => {
    if (!draggingRef.current) return

    const list = listRef.current

    draggingRef.current = false

    setIsDragging(false)

    if (list?.hasPointerCapture(event.pointerId)) {
      list.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <div
      ref={listRef}
      className={`recommendedRoutine__list ${
        isDragging ? 'recommendedRoutine__list--dragging' : ''
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDragStart={(event) => event.preventDefault()}
    >
      {RECOMMENDED_ROUTINES.map((routine) => (
        <RecommendedRoutineCard
          key={routine.id}
          category={routine.category}
          title={routine.title}
          theme={routine.theme}
          characterImage={routine.characterImage}
        />
      ))}
    </div>
  )
}

function HomeBottomSheet({ onDragProgress }) {
  const [sheetState, setSheetState] = useState('closed')
  const [dragY, setDragY] = useState(null)
  const [pointToast, setPointToast] = useState(null)
  const [isEpisodeOpen, setIsEpisodeOpen] = useState(false)

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

  const handlePointerDown = (event) => {
    draggingRef.current = true
    startYRef.current = event.clientY
    startTranslateRef.current = getCurrentTranslate()

    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event) => {
    if (!draggingRef.current) return

    const diff = event.clientY - startYRef.current

    let nextY = startTranslateRef.current + diff

    nextY = Math.max(SNAP.open, Math.min(nextY, SNAP.closed))

    setDragY(nextY)

    const progress = Math.max(0, Math.min(1, (SNAP.closed - nextY) / (SNAP.closed - SNAP.middle)))

    onDragProgress?.(progress)
  }

  const handlePointerUp = () => {
    if (!draggingRef.current) return

    draggingRef.current = false

    const currentY = getCurrentTranslate()

    const nearestState = Object.entries(SNAP).reduce((nearest, current) => {
      const [, nearestSnapY] = nearest
      const [, currentSnapY] = current

      return Math.abs(currentY - currentSnapY) < Math.abs(currentY - nearestSnapY)
        ? current
        : nearest
    })

    const [nextState, nextY] = nearestState

    setSheetState(nextState)
    setDragY(null)

    const progress = Math.max(0, Math.min(1, (SNAP.closed - nextY) / (SNAP.closed - SNAP.middle)))

    onDragProgress?.(progress)
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

  const recommendationProgress = Math.max(
    0,
    Math.min(1, (SNAP.closed - currentTranslate) / (SNAP.closed - SNAP.middle)),
  )

  const completedRoutineCount = ROUTINES.filter((routine) => routine.isCompleted).length

  const completedTodoCount = TODO_ROUTINES.filter((todo) => todo.isCompleted).length

  return (
    <div
      className={`bottom-sheet bottom-sheet--${sheetState} ${dragY !== null ? 'dragging' : ''}`}
      style={{
        transform: `translateY(${currentTranslate}px)`,
        '--recommendation-offset-y': `${-currentTranslate}px`,
        '--recommendation-opacity': recommendationProgress,
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

      <div className='bottomSheet__header'>
        <div className='bottomSheet__header__text'>
          <div className='bottomSheet__header__text--title'>오늘의 루틴</div>

          <div className='bottomSheet__header__text--description'>
            {ROUTINES.length}개 중 {completedRoutineCount}개를 완료했어요
          </div>
        </div>

        <div className='bottomSheet__header__icons'>
          <Icon
            name='icon-story'
            width={44}
            height={44}
            className='bottomSheet__header__icons--icon'
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation()
              setIsEpisodeOpen(true)
            }}
          />

          <Icon
            name='icon-streak'
            width={44}
            height={44}
            className='bottomSheet__header__icons--icon'
          />
        </div>
      </div>

      <div className='bottomSheet__content'>
        <section className='bottomSheet__routine-section'>
          <RoutineTimeline />

          <div className='routineList'>
            {ROUTINES.map((routine) => (
              <RoutineCard
                key={routine.id}
                category={routine.category}
                title={routine.title}
                theme={routine.theme}
                characterImage={routine.characterImage}
                isCompleted={routine.isCompleted}
                rewardPoint={routine.rewardPoint}
                onReceivePoint={handleReceivePoint}
              />
            ))}
          </div>
        </section>

        <section className='todoSection'>
          <div className='todoSection__header'>
            <h2 className='todoSection__title'>투두 리스트</h2>

            <p className='todoSection__description'>
              {TODO_ROUTINES.length}개 중 {completedTodoCount}개를 완료했어요
            </p>
          </div>

          <div className='todoList'>
            {TODO_ROUTINES.map((todo) => (
              <TodoCard
                key={todo.id}
                time={todo.time}
                title={todo.title}
                isCompleted={todo.isCompleted}
                rewardPoint={todo.rewardPoint}
                onReceivePoint={handleReceivePoint}
              />
            ))}
          </div>
        </section>
      </div>

      <section className='recommendedRoutine' aria-label='오늘의 추천 루틴'>
        <RecommendedRoutineList />
      </section>

      {pointToast && (
        <div key={pointToast.id} className='pointToast' role='status' aria-live='polite'>
          <div className='pointToast__content'>
            <span className='pointToast__icon'>+</span>
            <span className='pointToast__message'>{pointToast.point}P를 받았어요!</span>
          </div>
        </div>
      )}

      {isEpisodeOpen && <Episode onClose={() => setIsEpisodeOpen(false)} />}
    </div>
  )
}

export default HomeBottomSheet
