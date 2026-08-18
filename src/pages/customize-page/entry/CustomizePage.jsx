import './CustomizePage.css'
import ChatBubble from '../../../components/chat-bubble/ChatBubble'
import dummy from '../../../assets/avatar/avatar-default/dummy.png'

function CustomizePage() {
  return (
    <div className='custom__container'>
      <div className='custom__title'>커스터마이징</div>
      <div className='custom__avatar__container'>
        <img src={dummy} className='custom__avatar__container' />
        <ChatBubble content='아바타 말해요' />
      </div>
    </div>
  )
}

export default CustomizePage
