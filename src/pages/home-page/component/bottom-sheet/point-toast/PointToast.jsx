import './PointToast.css'

function PointToast({ point }) {
  return (
    <div className='pointToast' role='status' aria-live='polite'>
      <div className='pointToast__content'>
        <span className='pointToast__icon'>+</span>
        <span className='pointToast__message'>{point}P를 받았어요!</span>
      </div>
    </div>
  )
}

export default PointToast
