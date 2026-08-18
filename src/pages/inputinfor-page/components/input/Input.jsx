import './Input.css'
import xIcon from '../../../../assets/icons/icons-another/icons-x.svg'

function Input({ id, title, placeholder, maxLength, value, onChange, onClear }) {
  return (
    <div className='input'>
      <label className='input__title' htmlFor={id}>
        {title}
      </label>

      <div className='input__container'>
        <input
          className='input__field'
          id={id}
          name={id}
          type='text'
          placeholder={placeholder}
          maxLength={maxLength}
          value={value}
          onChange={onChange}
        />

        <button
          className='input__clear-button'
          type='button'
          onClick={onClear}
          disabled={!value}
          aria-label={`${title} 입력 내용 삭제`}
        >
          <img className='input__clear-icon' src={xIcon} alt='' />
        </button>
      </div>
    </div>
  )
}

export default Input
