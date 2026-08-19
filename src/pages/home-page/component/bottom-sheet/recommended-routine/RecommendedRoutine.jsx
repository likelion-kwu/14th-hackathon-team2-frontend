import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import RecommendedRoutineCard from '../recommended-routine-card/RecommendedRoutineCard'

import './RecommendedRoutine.css'

function RecommendedRoutine({ routines, progress }) {
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

    list.scrollLeft = startScrollLeftRef.current - (event.clientX - startXRef.current)

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

  return createPortal(
    <section
      className={`recommendedRoutine ${progress > 0 ? 'recommendedRoutine--visible' : ''}`}
      style={{ '--recommendation-opacity': progress }}
      aria-label='오늘의 추천 루틴'
    >
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
        {routines.map((routine) => (
          <RecommendedRoutineCard key={routine.id} routine={routine} />
        ))}
      </div>
    </section>,
    document.body,
  )
}

export default RecommendedRoutine
