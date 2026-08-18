import './AvatarSettingPage.css'

import MainTitle from '../../components/initial-page-title/MainTitle'
import SubTitle from '../../components/initial-page-title/SubTitle'
import BackButton from '../../components/back-button/BackButton'
import BottomButton from '../../components/bottom-button/BottomButton'

function AvatarSettingPage() {
  return (
    <div className='avatar-setting-page'>
      <div className='avatar-setting-page__back-area'>
        <BackButton />
      </div>

      <div className='avatar-setting-page__header'>
        <MainTitle>
          나만의 아바타를
          <br />
          만들어봐요
        </MainTitle>

        <SubTitle>추후 커스터마이징에서 수정할 수 있어요.</SubTitle>
      </div>

      <main className='avatar-setting-page__content'>
        <section className='avatar-setting-page__section'>
          <h2 className='avatar-setting-page__section-title'>아바타 생성</h2>

          <button className='avatar-setting-page__generator' type='button'>
            여기를 클릭해 아바타 생성하기
          </button>
        </section>

        <section className='avatar-setting-page__section avatar-setting-page__response'>
          <h2 className='avatar-setting-page__section-title'>아바타 응답 선택</h2>

          <div className='avatar-setting-page__speech-options'>
            <label className='avatar-setting-page__speech-option'>
              <input type='radio' name='speech-level' value='casual' defaultChecked />

              <span>반말</span>
            </label>

            <label className='avatar-setting-page__speech-option'>
              <input type='radio' name='speech-level' value='polite' />

              <span>존댓말</span>
            </label>
          </div>

          <div className='avatar-setting-page__length-options'>
            <label className='avatar-setting-page__length-option'>
              <input type='radio' name='response-length' value='short' defaultChecked />

              <span>짧은 응답</span>
            </label>

            <label className='avatar-setting-page__length-option'>
              <input type='radio' name='response-length' value='normal' />

              <span>보통 응답</span>
            </label>

            <label className='avatar-setting-page__length-option'>
              <input type='radio' name='response-length' value='long' />

              <span>자세한 응답</span>
            </label>
          </div>

          <div className='avatar-setting-page__style-options'>
            <label className='avatar-setting-page__style-option'>
              <input type='radio' name='speech-style' value='kind' defaultChecked />

              <span>다정함</span>
            </label>

            <label className='avatar-setting-page__style-option'>
              <input type='radio' name='speech-style' value='Cranky' />

              <span>까칠함</span>
            </label>

            <label className='avatar-setting-page__style-option'>
              <input type='radio' name='speech-style' value='playful' />

              <span>장난스러움</span>
            </label>
          </div>
        </section>
      </main>

      <div className='avatar-setting-page__bottom-bar' aria-hidden='true'>
        <span />
        <span />
        <span className='avatar-setting-page__bottom-dot--active' />
        <span />
      </div>

      <BottomButton disabled>다음</BottomButton>
    </div>
  )
}

export default AvatarSettingPage
