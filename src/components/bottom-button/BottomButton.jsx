import './BottomButton.css'

function BottomButton({ children, onClick, disabled = false }) {
  return (
    <button className='bottom-button' onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

export default BottomButton
