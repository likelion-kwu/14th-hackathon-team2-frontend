import './RecommendedRoutineCard.css'

function RecommendedRoutineCard({ routine, onAdd }) {
  const { category, title, theme, characterImage } = routine

  return (
    <article className={`recommendedRoutineCard recommendedRoutineCard--${theme}`}>
      <div className='recommendedRoutineCard__character-area'>
        <img
          src={characterImage}
          alt={`${category} 캐릭터`}
          className='recommendedRoutineCard__character'
          draggable='false'
        />
      </div>

      <div className='recommendedRoutineCard__text'>
        <span className='recommendedRoutineCard__category'>{category}</span>

        <span className='recommendedRoutineCard__title'>{title}</span>
      </div>

      <button
        type='button'
        className='recommendedRoutineCard__add-button'
        aria-label={`${category} 추천 루틴 추가`}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={() => onAdd?.(routine)}
      >
        <span className='recommendedRoutineCard__add-icon'>+</span>
        <span>Add</span>
      </button>
    </article>
  )
}

export default RecommendedRoutineCard
