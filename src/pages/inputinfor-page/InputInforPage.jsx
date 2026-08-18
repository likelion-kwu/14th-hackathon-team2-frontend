import './InputInforPage.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import MainTitle from '../../components/initial-page-title/MainTitle'
import SubTitle from '../../components/initial-page-title/SubTitle'
import BottomButton from '../../components/bottom-button/BottomButton'
import BackButton from '../../components/back-button/BackButton'

import Input from './components/input/Input'
import bottomBarImage from '../../assets/inputinfor-page/image-bottombar2.svg'

function InputInforPage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [nickname, setNickname] = useState('')
  const [gender, setGender] = useState('')

  const isFormValid = name.trim() !== '' && nickname.trim() !== '' && gender !== ''

  const handleBack = () => {
    navigate(-1)
  }

  const handleNext = () => {
    if (!isFormValid) return

    navigate('/tracksetting')
  }

  return (
    <div className='input-infor-page'>
      <div className='input-infor-page__back-area'>
        <BackButton onClick={handleBack} />
      </div>

      <div className='input-infor-page__header'>
        <MainTitle>
          시작하기 전,
          <br />
          정보를 입력해 주세요
        </MainTitle>

        <SubTitle>앞으로 닉네임으로 불러드릴게요.</SubTitle>
      </div>

      <div className='input-infor-page__form'>
        <Input
          id='name'
          title='이름'
          placeholder='본명을 입력하세요'
          value={name}
          onChange={(event) => setName(event.target.value)}
          onClear={() => setName('')}
        />

        <Input
          id='nickname'
          title='닉네임'
          placeholder='8글자 이내의 닉네임을 입력하세요'
          maxLength={8}
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          onClear={() => setNickname('')}
        />

        <fieldset className='gender-input'>
          <legend className='gender-input__title'>성별</legend>

          <div className='gender-input__options'>
            <label className='gender-input__option'>
              <input
                type='radio'
                name='gender'
                value='male'
                checked={gender === 'male'}
                onChange={(event) => setGender(event.target.value)}
              />
              <span>남성</span>
            </label>

            <label className='gender-input__option'>
              <input
                type='radio'
                name='gender'
                value='female'
                checked={gender === 'female'}
                onChange={(event) => setGender(event.target.value)}
              />
              <span>여성</span>
            </label>
          </div>
        </fieldset>
      </div>

      <img className='input-infor-page__bottom-bar' src={bottomBarImage} alt='' />

      <BottomButton onClick={handleNext} disabled={!isFormValid}>
        다음
      </BottomButton>
    </div>
  )
}

export default InputInforPage
