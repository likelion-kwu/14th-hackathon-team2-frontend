import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getAvatarImage } from '../../../api/avatarApi'
import { getHome } from '../../../api/homeApi'
import { getItems, updateAvatarEquipment } from '../../../api/itemApi'

import ChatBubble from '../../../components/chat-bubble/ChatBubble'

import dummy from '../../../assets/avatar/avatar-default/dummy.png'

import CatalogBottomSheet from '../component/bottom-sheet/CatalogBottomSheet'
import { getItemAsset } from '../itemAssetMap'

import './CustomizePage.css'

function CustomizePage() {
  const navigate = useNavigate()

  const [sheetProgress, setSheetProgress] = useState(0)
  const [avatarImageUrl, setAvatarImageUrl] = useState('')
  const [totalPoints, setTotalPoints] = useState(0)
  const [items, setItems] = useState([])
  const [equippedItemIds, setEquippedItemIds] = useState([])
  const [isItemsLoading, setIsItemsLoading] = useState(false)
  const [isEquipmentSaving, setIsEquipmentSaving] = useState(false)
  const [itemError, setItemError] = useState('')

  const avatarHeight = 400 - sheetProgress * 100
  const avatarTranslateY = -sheetProgress * 30

  const equippedItems = items.filter((item) => equippedItemIds.includes(item.id))

  useEffect(() => {
    let isCancelled = false

    const loadPoints = async () => {
      try {
        const home = await getHome()

        if (isCancelled) return

        setTotalPoints(home?.points?.totalEarned ?? 0)
      } catch (error) {
        console.error('포인트 정보를 불러오지 못했습니다.', error)
      }
    }

    loadPoints()

    return () => {
      isCancelled = true
    }
  }, [])

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
    let isCancelled = false

    const loadItems = async () => {
      setIsItemsLoading(true)
      setItemError('')

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
          setItemError(error.message ?? '아이템 목록을 불러오지 못했습니다.')
        }
      } finally {
        if (!isCancelled) {
          setIsItemsLoading(false)
        }
      }
    }

    loadItems()

    return () => {
      isCancelled = true
    }
  }, [])

  const handleItemToggle = async (item) => {
    if (!item.owned || isEquipmentSaving) return

    const previousItemIds = equippedItemIds
    const isEquipped = previousItemIds.includes(item.id)

    const nextItemIds = isEquipped
      ? previousItemIds.filter((itemId) => itemId !== item.id)
      : [...previousItemIds, item.id]

    setEquippedItemIds(nextItemIds)
    setIsEquipmentSaving(true)
    setItemError('')

    try {
      const result = await updateAvatarEquipment(nextItemIds)

      const savedItemIds = result?.equippedItems?.map((equippedItem) => equippedItem.itemId)

      if (savedItemIds) {
        setEquippedItemIds(savedItemIds)
      }
    } catch (error) {
      console.error('아이템 장착 상태를 저장하지 못했습니다.', error)

      setEquippedItemIds(previousItemIds)

      setItemError(error.message ?? '아이템 장착 상태를 저장하지 못했습니다.')
    } finally {
      setIsEquipmentSaving(false)
    }
  }

  const handleAvatarSettingClick = () => {
    navigate('/setting')
  }

  return (
    <div className='custom__container'>
      <div
        className='custom__title'
        style={{
          opacity: 1 - sheetProgress,
          maxHeight: `${40 * (1 - sheetProgress)}px`,
        }}
      >
        커스터마이징
      </div>

      <div
        className='custom__avatar__container'
        style={{
          transform: `translateY(${avatarTranslateY}px)`,
        }}
      >
        <div
          className='custom__avatar-stage'
          style={{
            height: `${avatarHeight}px`,
          }}
        >
          <img src={avatarImageUrl || dummy} className='custom__avatar' alt='내 아바타' />

          {equippedItems.map((item) => {
            const itemImage = getItemAsset(item.assetKey)

            if (!itemImage) return null

            return (
              <img
                key={item.id}
                src={itemImage}
                alt=''
                className='custom__avatar-item'
                aria-hidden='true'
              />
            )
          })}
        </div>
      </div>

      <ChatBubble content='어떤 아이템을 착용해 볼까요?' />

      <CatalogBottomSheet
        items={items}
        equippedItemIds={equippedItemIds}
        totalPoints={totalPoints}
        isLoading={isItemsLoading}
        isSaving={isEquipmentSaving}
        errorMessage={itemError}
        onItemToggle={handleItemToggle}
        onAvatarSettingClick={handleAvatarSettingClick}
        onDragProgress={setSheetProgress}
      />
    </div>
  )
}

export default CustomizePage
