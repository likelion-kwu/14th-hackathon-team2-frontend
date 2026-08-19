import './TodoCard.css'

function TodoCard({ todo, onReceivePoint }) {
  const { time, title, isCompleted, rewardPoint } = todo

  return (
    <article className={`todoCard ${isCompleted ? 'todoCard--completed' : ''}`}>
      <button
        type='button'
        className={`todoCard__check ${
          isCompleted ? 'todoCard__check--completed' : ''
        }`}
        aria-label={`${title} 완료 여부`}
      />

      <div className='todoCard__text'>
        <span className='todoCard__time'>{time}</span>
        <span className='todoCard__title'>{title}</span>
      </div>

      {isCompleted && (
        <button
          type='button'
          className='todoCard__reward-button'
          onClick={() => onReceivePoint(rewardPoint)}
        >
          {rewardPoint}P 받기
        </button>
      )}
    </article>
  )
}

export default TodoCard
