import { useEffect, useRef, useState } from 'react'

import { getItems, updateAvatarEquipment } from '../../../../api/itemApi'

import './CatalogBottomSheet.css'

function CatalogBottomSheet({ onDragProgress }) {
  const [sheetState, setSheetState] = useState('closed')

  const [dragY, setDragY] = useState(null)

  const [items, setItems] = useState([])

  const [equippedItemIds, setEquippedItemIds] = useState([])

  const [isLoading, setIsLoading] = useState(false)

  const [isSaving, setIsSaving] = useState(false)

  const [errorMessage, setErrorMessage] = useState('')

  const startYRef = useRef(0)
  const startTranslateRef = useRef(0)
  const draggingRef = useRef(false)

  const screenHeight = window.innerHeight

  const SNAP = {
    open: 0,
    middle: screenHeight * 0.3,
    closed: screenHeight * 0.65,
  }

  useEffect(() => {
    let isCancelled = false

    const loadItems = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const result = await getItems({
          ownedOnly: false,
        })

        if (isCancelled) return

        const itemList = Array.isArray(result) ? result : []

        setItems(itemList)

        setEquippedItemIds(itemList.filter((item) => item.equipped).map((item) => item.id))
      } catch (error) {
        console.error('아이템 목록을 불러오지 못했습니다.', error)

        if (!isCancelled) {
          setErrorMessage(error.message ?? '아이템 목록을 불러오지 못했습니다.')
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadItems()

    return () => {
      isCancelled = true
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

  const handleItemClick = async (item) => {
    if (!item.owned || isSaving) return

    const previousItemIds = equippedItemIds

    const isEquipped = previousItemIds.includes(item.id)

    const nextItemIds = isEquipped
      ? previousItemIds.filter((itemId) => itemId !== item.id)
      : [...previousItemIds, item.id]

    setEquippedItemIds(nextItemIds)
    setIsSaving(true)
    setErrorMessage('')

    try {
      const result = await updateAvatarEquipment(nextItemIds)

      const savedItemIds = result?.equippedItems?.map((equippedItem) => equippedItem.itemId)

      if (savedItemIds) {
        setEquippedItemIds(savedItemIds)
      }
    } catch (error) {
      console.error('아이템 장착에 실패했습니다.', error)

      setEquippedItemIds(previousItemIds)

      setErrorMessage(error.message ?? '아이템 장착에 실패했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  const ownedItemCount = items.filter((item) => item.owned).length

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
          <div className='bottomSheet__header__text--title'>아이템 도감</div>

          <div className='bottomSheet__header__text--description'>
            {items.length}개 중 {ownedItemCount}개를 보유하고 있어요
          </div>
        </div>

        <div className='bottomSheet__header__icons'>
          {isSaving && <span className='catalog__saving'>저장 중...</span>}
        </div>
      </div>

      <div className='catalog__content'>
        {errorMessage && <div className='catalog__error'>{errorMessage}</div>}

        {isLoading ? (
          <div className='catalog__empty'>아이템을 불러오는 중...</div>
        ) : items.length === 0 ? (
          <div className='catalog__empty'>아직 등록된 아이템이 없어요.</div>
        ) : (
          <div className='catalog__list'>
            {items.map((item) => {
              const isEquipped = equippedItemIds.includes(item.id)

              return (
                <button
                  key={item.id}
                  type='button'
                  className={`catalog__item ${
                    item.owned ? 'catalog__item--owned' : 'catalog__item--locked'
                  } ${isEquipped ? 'catalog__item--equipped' : ''}`}
                  disabled={!item.owned || isSaving}
                  onClick={() => handleItemClick(item)}
                >
                  <div className='catalog__item__preview'>
                    {item.name?.slice(0, 1) ?? '?'}

                    {!item.owned && <span className='catalog__item__lock'>잠김</span>}

                    {isEquipped && <span className='catalog__item__equipped'>착용 중</span>}
                  </div>

                  <div className='catalog__item__name'>{item.name}</div>

                  <div className='catalog__item__type'>{item.type}</div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default CatalogBottomSheet
