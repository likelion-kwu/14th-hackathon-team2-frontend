import { useState, useRef } from 'react'
import './HomePage.css'
import ChatBubble from '../../../components/chat-bubble/ChatBubble'
import dummy from '../../../assets/avatar/avatar-default/dummy.png'
import HomeBottomSheet from '../component/bottom-sheet/HomeBottomSheet'

function HomePage() {
  const [sheetProgress, setSheetProgress] = useState(0)
  const [isChatVisible, setIsChatVisible] = useState(false)
  const [chatContent, setChatContent] = useState('')

  const chatTimerRef = useRef(null)

  const avatarHeight = 400 - sheetProgress * 100
  const avatarTranslateY = -sheetProgress * 30

  const dummyMessages = [
    '오늘도 같이 해볼까요?',
    '조금만 더 힘내봐요!',
    '오늘 루틴도 기다리고 있어요.',
    '꾸준히 하고 있는 거 멋져요!',
    '저도 점점 건강해지는 것 같아요.',
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
    <div className='home__container'>
      <div
        className='home__title'
        style={{
          opacity: 1 - sheetProgress,
          maxHeight: `${40 * (1 - sheetProgress)}px`,
        }}
      >
        반가워요, --님
      </div>

      <div
        className='home__avatar__container'
        style={{
          transform: `translateY(${avatarTranslateY}px)`,
        }}
      >
        <img
          src={dummy}
          className='home__avatar'
          onClick={handleAvatarClick}
          style={{
            height: `${avatarHeight}px`,
          }}
        />

        {isChatVisible && <ChatBubble content={chatContent} />}
      </div>

      <HomeBottomSheet onDragProgress={setSheetProgress} />
    </div>
  )
}

export default HomePage
