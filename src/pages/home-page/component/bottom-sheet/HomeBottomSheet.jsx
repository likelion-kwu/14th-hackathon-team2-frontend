import { useRef, useState } from 'react'
import { Icon } from '../../../../components/icon/Icon'

import imageDiet from '../../../../assets/home-bottom-sheet/character/image-diet.svg'
import imageHealth from '../../../../assets/home-bottom-sheet/character/image-health.svg'
import imageSkin from '../../../../assets/home-bottom-sheet/character/image-skin.svg'
import imageWellbeing from '../../../../assets/home-bottom-sheet/character/image-wellbeing.svg'
import imageMoon from '../../../../assets/home-bottom-sheet/image-moon.svg'
import imageSun from '../../../../assets/home-bottom-sheet/image-sun.svg'

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

      <TimelineDots count={2} active />

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
function RoutineCard({ category, title, theme, characterImage, isCompleted, rewardPoint }) {
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
        <button type='button' className='routineCard__reward-button'>
          {rewardPoint}P 받기
        </button>
      ) : (
        <img src={characterImage} alt={`${category} 캐릭터`} className='routineCard__character' />
      )}
    </article>
  )
}

function HomeBottomSheet({ onDragProgress }) {
  const [sheetState, setSheetState] = useState('closed')
  const [dragY, setDragY] = useState(null)

  const startYRef = useRef(0)
  const startTranslateRef = useRef(0)
  const draggingRef = useRef(false)

  const screenHeight = window.innerHeight

  const SNAP = {
    open: 0,
    middle: screenHeight * 0.3,
    closed: screenHeight * 0.65,
  }

  const getCurrentTranslate = () => {
    if (dragY !== null) return dragY

    return SNAP[sheetState]
  }

  const handlePointerDown = (e) => {
    draggingRef.current = true

    startYRef.current = e.clientY
    startTranslateRef.current = getCurrentTranslate()

    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e) => {
    if (!draggingRef.current) return

    const diff = e.clientY - startYRef.current

    let nextY = startTranslateRef.current + diff

    nextY = Math.max(SNAP.open, Math.min(nextY, SNAP.closed))

    setDragY(nextY)

    const progress = Math.min(1, (SNAP.closed - nextY) / (SNAP.closed - SNAP.middle))

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

    const progress = Math.min(1, (SNAP.closed - nextY) / (SNAP.closed - SNAP.middle))

    onDragProgress?.(progress)
  }

  return (
    <div
      className={`bottom-sheet ${dragY !== null ? 'dragging' : ''}`}
      style={{
        transform: `translateY(${getCurrentTranslate()}px)`,
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

          <div className='bottomSheet__header__text--description'>5개 중 0개를 완료했어요</div>
        </div>

        <div className='bottomSheet__header__icons'>
          <Icon
            name='icon-story'
            width={44}
            height={44}
            className='bottomSheet__header__icons--icon'
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
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default HomeBottomSheet
