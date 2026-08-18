import './ChatBubble.css'
import { Icon } from '../icon/Icon'

function ChatBubble({ content }) {
  return (
    <div className='chat__container'>
      <Icon name='chat-bubble-arrow' width={38} height={12} />
      <div className='chat__content'>{content}</div>
    </div>
  )
}

export default ChatBubble
