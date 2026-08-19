import { useNavigate } from 'react-router-dom'

import './RoutineCard.css'

function RoutineCard({ routine, onReceivePoint }) {
  const navigate = useNavigate()

  const { category, title, theme, characterImage, isCompleted, rewardPoint } = routine

  const handleVerificationClick = () => {
    if (isCompleted) return

    navigate('/verification', {
      state: {
        routine,
        mockResult: 'success',
      },
    })
  }

  return (
    <article
      className={`routineCard routineCard--${theme} ${isCompleted ? 'routineCard--completed' : ''}`}
    >
      <button
        type='button'
        className={`routineCard__check ${isCompleted ? 'routineCard__check--completed' : ''}`}
        aria-label={`${title} 루틴 인증하기`}
        disabled={isCompleted}
        onClick={handleVerificationClick}
      />

      <div className='routineCard__text'>
        <span className='routineCard__category'>{category}</span>
        <span className='routineCard__title'>{title}</span>
      </div>

      {isCompleted ? (
        <button
          type='button'
          className='routineCard__reward-button'
          onClick={() => onReceivePoint?.(rewardPoint)}
        >
          {rewardPoint}P 받기
        </button>
      ) : (
        <img src={characterImage} alt={`${category} 캐릭터`} className='routineCard__character' />
      )}
    </article>
  )
}

export default RoutineCard
