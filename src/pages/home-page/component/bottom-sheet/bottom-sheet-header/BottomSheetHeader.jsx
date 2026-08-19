import { Icon } from '../../../../../components/icon/Icon'
import Achievement from '../../../Streak-achievement-popup/achievement.jsx'

import './BottomSheetHeader.css'

function BottomSheetHeader({
  totalCount,
  completedCount,
  achievementData,
  onAchievementOpenChange,
  onStoryClick,
}) {
  return (
    <header className='bottomSheet__header'>
      <div className='bottomSheet__header__text'>
        <div className='bottomSheet__header__text--title'>오늘의 루틴</div>

        <div className='bottomSheet__header__text--description'>
          {totalCount}개 중 {completedCount}개를 완료했어요
        </div>
      </div>

      <div className='bottomSheet__header__icons'>
        <button
          type='button'
          className='bottomSheet__header__icon-button'
          aria-label='에피소드 보기'
          onClick={onStoryClick}
        >
          <Icon name='icon-story' width={44} height={44} />
        </button>

        <Achievement data={achievementData} onOpenChange={onAchievementOpenChange} />
      </div>
    </header>
  )
}

export default BottomSheetHeader
