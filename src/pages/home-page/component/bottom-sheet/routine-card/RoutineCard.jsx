import './RoutineCard.css'

function RoutineCard({ routine, onReceivePoint }) {
  const {
    category,
    title,
    theme,
    characterImage,
    isCompleted,
    rewardPoint,
  } = routine

  return (
    <article
      className={`routineCard routineCard--${theme} ${
        isCompleted ? 'routineCard--completed' : ''
      }`}
    >
      <button
        type='button'
        className={`routineCard__check ${
          isCompleted ? 'routineCard__check--completed' : ''
        }`}
        aria-label={`${title} 완료 여부`}
      />

      <div className='routineCard__text'>
        <span className='routineCard__category'>{category}</span>
        <span className='routineCard__title'>{title}</span>
      </div>

      {isCompleted ? (
        <button
          type='button'
          className='routineCard__reward-button'
          onClick={() => onReceivePoint(rewardPoint)}
        >
          {rewardPoint}P 받기
        </button>
      ) : (
        <img
          src={characterImage}
          alt={`${category} 캐릭터`}
          className='routineCard__character'
        />
      )}
    </article>
  )
}

export default RoutineCard
