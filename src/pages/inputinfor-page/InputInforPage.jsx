import MainTitle from '../../components/initial-page-title/MainTitle'
import SubTitle from '../../components/initial-page-title/SubTitle'
import Input from './components/input/Input'

function InputInforPage() {
  return (
    <div className='input-infor-page'>
      <MainTitle>
        시작하기 전,
        <br />
        정보를 입력해 주세요
      </MainTitle>

      <SubTitle>앞으로 닉네임을 불러드릴게요.</SubTitle>

      <Input id='name' title='이름' placeholder='본명을 입력하세요' />

      <Input
        id='nickname'
        title='닉네임'
        placeholder='8글자 이내의 닉네임을 입력하세요'
        maxLength={8}
      />
    </div>
  )
}

export default InputInforPage
