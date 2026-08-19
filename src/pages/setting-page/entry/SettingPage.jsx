import './SettingPage.css'
import { Icon } from '../../../components/icon/Icon'
import dummyProflie from '../../../assets/avatar/avatar-default/dummy-profile.png'

function SettingPage() {
  return (
    <div className='set__container'>
      <div className='set__header'>
        <Icon name='back-arrow' width={8} height={16} className='set__header--back' />
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
            <div className='set__option__behavior--group'>
              <div className='set__option__behavir'>반말</div>
              <div className='set__option__behavir'>존댓말</div>
            </div>
            <div className='set__option__length--group'>
              <div className='set__option__length'>짧은 응답</div>
              <div className='set__option__length'>보통 응답</div>
              <div className='set__option__length'>자세한 응답</div>
            </div>
            <div className='set__option__tone--group'>
              <div className='set__option__tone'>다정함</div>
              <div className='set__option__tone'>까칠함</div>
              <div className='set__option__tone'>장난스러움</div>
            </div>
          </div>
        </div>
        <div className='set__kakao'>카카오톡으로 설정하기</div>
      </div>
    </div>
  )
}

export default SettingPage
