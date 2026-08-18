import { useState } from 'react'
import './CustomizePage.css'
import ChatBubble from '../../../components/chat-bubble/ChatBubble'
import dummy from '../../../assets/avatar/avatar-default/dummy.png'
import CatalogBottomSheet from '../component/bottom-sheet/CatalogBottomSheet'

function CustomizePage() {
  const [sheetProgress, setSheetProgress] = useState(0)

  const avatarHeight = 400 - sheetProgress * 100
  const avatarTranslateY = -sheetProgress * 30

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
        <img
          src={dummy}
          className='custom__avatar'
          style={{
            height: `${avatarHeight}px`,
          }}
        />
      </div>

      <ChatBubble content='아바타 말해요' />

      <CatalogBottomSheet onDragProgress={setSheetProgress} />
    </div>
  )
}

export default CustomizePage
