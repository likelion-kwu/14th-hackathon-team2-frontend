import './Input.css'

function Input({ id, title, placeholder, maxLength, value, onChange }) {
  return (
    <div className='input'>
      <label className='input__title' htmlFor={id}>
        {title}
      </label>

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
    </div>
  )
}

export default Input
