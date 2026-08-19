import { useState } from 'react'
import './SettingPage.css'
import { Icon } from '../../../components/icon/Icon'
import dummyProflie from '../../../assets/avatar/avatar-default/dummy-profile.png'
import { useNavigate } from 'react-router-dom'

function SettingPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState({
    speech: '반말',
    length: '보통 응답',
    personality: '까칠함',
  })

  const handleSelect = (category, value) => {
    setSelected((prev) => ({
      ...prev,
      [category]: value,
    }))
  }

  return (
    <div className='set__container'>
      <div className='set__header'>
        <Icon
          name='back-arrow'
          width={8}
          height={16}
          className='set__header--back'
          onClick={() => navigate(-1)}
        />
        <div className='set__header--title'>아바타 설정</div>
      </div>

      <div className='set__content'>
        <div className='set__myavatar'>
          <div className='set__content--title'>나의 현재 아바타</div>
          <img src={dummyProflie} className='set__myavatar--image' />
        </div>

        <div className='set__response'>
          <div className='set__content--title'>아바타 응답 선택</div>

          <div className='set__options'>
            <div className='set__option--group'>
              <button
                type='button'
                className={`set__option--opt ${selected.speech === '반말' ? 'selected' : ''}`}
                onClick={() => handleSelect('speech', '반말')}
              >
                반말
              </button>

              <button
                type='button'
                className={`set__option--opt ${selected.speech === '존댓말' ? 'selected' : ''}`}
                onClick={() => handleSelect('speech', '존댓말')}
              >
                존댓말
              </button>
            </div>

            <div className='set__option--group'>
              <button
                type='button'
                className={`set__option--opt ${selected.length === '짧은 응답' ? 'selected' : ''}`}
                onClick={() => handleSelect('length', '짧은 응답')}
              >
                짧은 응답
              </button>

              <button
                type='button'
                className={`set__option--opt ${selected.length === '보통 응답' ? 'selected' : ''}`}
                onClick={() => handleSelect('length', '보통 응답')}
              >
                보통 응답
              </button>

              <button
                type='button'
                className={`set__option--opt ${
                  selected.length === '자세한 응답' ? 'selected' : ''
                }`}
                onClick={() => handleSelect('length', '자세한 응답')}
              >
                자세한 응답
              </button>
            </div>

            <div className='set__option--group'>
              <button
                type='button'
                className={`set__option--opt ${
                  selected.personality === '다정함' ? 'selected' : ''
                }`}
                onClick={() => handleSelect('personality', '다정함')}
              >
                다정함
              </button>

              <button
                type='button'
                className={`set__option--opt ${
                  selected.personality === '까칠함' ? 'selected' : ''
                }`}
                onClick={() => handleSelect('personality', '까칠함')}
              >
                까칠함
              </button>

              <button
                type='button'
                className={`set__option--opt ${
                  selected.personality === '장난스러움' ? 'selected' : ''
                }`}
                onClick={() => handleSelect('personality', '장난스러움')}
              >
                장난스러움
              </button>
            </div>
          </div>
        </div>

        <div className='set__kakao'>카카오톡으로 설정하기</div>
      </div>
    </div>
  )
}

export default SettingPage
