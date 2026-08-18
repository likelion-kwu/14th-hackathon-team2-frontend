import './BottomButton.css'

function BottomButton({ children }) {
  return (
    <button className='bottom-button' type='button'>
      {children}
    </button>
  )
}

export default BottomButton
