import './BackButton.css'
import arrowImage from '../../assets/icons/icons-another/icons-arrow.svg'

function BackButton({ onClick }) {
  return (
    <button className='back-button' type='button' onClick={onClick} aria-label='뒤로가기'>
      <img className='back-button__icon' src={arrowImage} alt='' />
    </button>
  )
}

export default BackButton
