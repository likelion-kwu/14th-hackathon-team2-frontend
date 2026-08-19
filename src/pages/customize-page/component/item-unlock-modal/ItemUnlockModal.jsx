import './ItemUnlockModal.css'

function ItemUnlockModal({ isOpen, item, onClose, onConfirm }) {
  if (!isOpen) return null

  return (
    <div className='item-unlock-modal'>
      <div className='item-unlock-modal__backdrop' onClick={onClose} />

      <div className='item-unlock-modal__container'>
        <div className='item-unlock-modal__handle'>
          <div className='item-unlock-modal__handle--button'></div>
        </div>
        <div className='item-unlock-modal__title'>아이템 해금</div>
        <div className='item-unlock-modal__content'>
          <img
            src={item.image}
            alt='해금할 아이템'
            className='item-unlock-modal__image'
            draggable={false}
          />
          <button className='item-unlock-modal__button' onClick={onConfirm}>
            50P를 사용하여 아이템 해금하기
          </button>
        </div>
      </div>
    </div>
  )
}

export default ItemUnlockModal
