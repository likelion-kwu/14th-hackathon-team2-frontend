import { useNavigate } from 'react-router-dom'

import './TodoCard.css'

function TodoCard({ todo, onEdit }) {
  const navigate = useNavigate()

  const { time, title, isCompleted, routineId } = todo

  const handleVerificationClick = (event) => {
    event.stopPropagation()

    if (isCompleted) return

    navigate('/verification', {
      state: {
        routine: todo,
      },
    })
  }

  const handleEditClick = () => {
    if (!routineId) {
      alert('수정할 투두 정보를 찾지 못했습니다.')
      return
    }

    onEdit?.(todo)
  }

  return (
    <article
      className={`todoCard ${isCompleted ? 'todoCard--completed' : ''}`}
      onClick={handleEditClick}
    >
      <button
        type='button'
        className={`todoCard__check ${isCompleted ? 'todoCard__check--completed' : ''}`}
        aria-label={`${title} 투두 인증하기`}
        disabled={isCompleted}
        onClick={handleVerificationClick}
      />

      <div className='todoCard__text'>
        <span className='todoCard__time'>{time}</span>
        <span className='todoCard__title'>{title}</span>
      </div>
    </article>
  )
}

export default TodoCard
