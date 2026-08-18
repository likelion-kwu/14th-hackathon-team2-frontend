import { useRef, useState } from 'react'
import { Icon } from '../../../../components/icon/Icon'
import './CatalogBottomSheet.css'

function CatalogBottomSheet({ onDragProgress }) {
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
    </div>
  )
}

export default CatalogBottomSheet
