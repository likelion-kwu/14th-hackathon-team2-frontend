import { useRef, useState } from 'react'
import './CustomizePage.css'
import ChatBubble from '../../../components/chat-bubble/ChatBubble'
import dummy from '../../../assets/avatar/avatar-default/dummy.png'
import CatalogBottomSheet from '../component/bottom-sheet/CatalogBottomSheet'

function CustomizePage() {
  const [sheetProgress, setSheetProgress] = useState(0)
  const [isChatVisible, setIsChatVisible] = useState(false)
  const [chatContent, setChatContent] = useState('')

  const chatTimerRef = useRef(null)

  const avatarHeight = 400 - sheetProgress * 100
  const avatarTranslateY = -sheetProgress * 30

  // 백엔드 연결 전 임시 대사
  const dummyMessages = [
    '이 옷은 어때요?',
    '새로운 아이템을 입어보고 싶어요!',
    '오늘은 어떤 스타일로 꾸며줄 거예요?',
    '이것도 잘 어울릴 것 같은데요?',
    '멋지게 꾸며주세요!',
  ]

  const handleAvatarClick = () => {
    const randomIndex = Math.floor(Math.random() * dummyMessages.length)
    const message = dummyMessages[randomIndex]

    setChatContent(message)
    setIsChatVisible(true)

    if (chatTimerRef.current) {
      clearTimeout(chatTimerRef.current)
    }

    chatTimerRef.current = setTimeout(() => {
      setIsChatVisible(false)
    }, 2000)
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
        <img
          src={dummy}
          className='custom__avatar'
          onClick={handleAvatarClick}
          style={{
            height: `${avatarHeight}px`,
          }}
        />

        {isChatVisible && <ChatBubble content={chatContent} />}
      </div>

      <CatalogBottomSheet onDragProgress={setSheetProgress} />
    </div>
  )
}

export default CustomizePage
