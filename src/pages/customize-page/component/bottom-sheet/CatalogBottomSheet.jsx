import { useRef, useState } from 'react'

import { Icon } from '../../../../components/icon/Icon'
import { getItemAsset } from '../../itemAssetMap'

import './CatalogBottomSheet.css'

function CatalogBottomSheet({
  items = [],
  equippedItemIds = [],
  totalPoints = 0,
  isLoading = false,
  isSaving = false,
  errorMessage = '',
  onItemToggle,
  onAvatarSettingClick,
  onDragProgress,
}) {
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

  const ownedCount = items.filter((item) => item.owned).length

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
      const [, currentYValue] = current

      return Math.abs(currentY - currentYValue) < Math.abs(currentY - nearestY) ? current : nearest
    })

    setSheetState(nextState)
    setDragY(null)

    onDragProgress?.(getProgress(nextY))
  }

  return (
    <section
      className={`catalogSheet catalogSheet--${sheetState} ${
        dragY !== null ? 'catalogSheet--dragging' : ''
      }`}
      style={{
        transform: `translateY(${getCurrentTranslate()}px)`,
      }}
      aria-label='아이템 도감'
    >
      <div
        className='catalogSheet__drag-area'
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className='catalogSheet__handle' />
      </div>

      <header className='catalogSheet__header'>
        <div>
          <h2 className='catalogSheet__title'>아이템 도감</h2>

          <p className='catalogSheet__description'>
            {items.length}개 중 {ownedCount}개를 보유하고 있어요
          </p>
        </div>

        <div className='catalogSheet__header-actions'>
          <div className='catalogSheet__point' aria-label={`누적 ${totalPoints}포인트`}>
            {String(totalPoints).padStart(3, '0')}P
          </div>

          <button
            type='button'
            className='catalogSheet__setting-button'
            aria-label='아바타 설정 열기'
            onClick={onAvatarSettingClick}
          >
            <Icon name='icon-setting' width={44} height={44} />
          </button>

          {isSaving && <span className='catalogSheet__saving'>저장 중...</span>}
        </div>
      </header>

      <div className='catalogSheet__content'>
        {errorMessage && <p className='catalogSheet__error'>{errorMessage}</p>}

        {isLoading ? (
          <p className='catalogSheet__empty'>아이템을 불러오는 중...</p>
        ) : items.length === 0 ? (
          <p className='catalogSheet__empty'>아직 등록된 아이템이 없어요.</p>
        ) : (
          <div className='catalogSheet__grid'>
            {items.map((item) => {
              const isEquipped = equippedItemIds.includes(item.id)
              const itemImage = getItemAsset(item.assetKey)

              return (
                <button
                  key={item.id}
                  type='button'
                  className={`catalogItem ${
                    item.owned ? 'catalogItem--owned' : 'catalogItem--locked'
                  } ${isEquipped ? 'catalogItem--equipped' : ''}`}
                  disabled={!item.owned || isSaving}
                  aria-pressed={isEquipped}
                  onClick={() => onItemToggle?.(item)}
                >
                  <span className='catalogItem__image-area'>
                    {itemImage ? (
                      <img src={itemImage} alt='' className='catalogItem__image' />
                    ) : (
                      <span className='catalogItem__placeholder' aria-hidden='true'>
                        {item.name?.slice(0, 1) ?? '?'}
                      </span>
                    )}

                    {!item.owned && <span className='catalogItem__lock'>잠김</span>}

                    {isEquipped && <span className='catalogItem__equipped-badge'>착용 중</span>}
                  </span>

                  <span className='catalogItem__name'>{item.name}</span>

                  <span className='catalogItem__type'>{item.type}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default CatalogBottomSheet
