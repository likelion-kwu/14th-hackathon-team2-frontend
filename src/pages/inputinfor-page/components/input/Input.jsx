import './Input.css'

function Input({ id, title, placeholder, maxLength }) {
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
      />
    </div>
  )
}

export default Input
