import './RankinPage.css'
import { Icon } from '../../../components/icon/Icon'

function RankingPage() {
  return (
    <div className='rank__container'>
      <div className='rank__title'>경쟁하기</div>

      <section className='rank__board'>
        <div className='rank__board__title'>리더보드</div>
        <section className='rank__board__content'>
          <div className='rank__rankers'>
            <div className='rank__rankers__ranker ranker-second'>
              <Icon
                name='rank-profile'
                width={80}
                height={80}
                className='rank__rankers__ranker--image'
              />
              <div className='rank__rankers__ranker--nickname'>사용자 2</div>
              <div className='rank__rankers__ranker--score'>누적 100P</div>
            </div>
            <div className='rank__rankers__ranker ranker-first'>
              <Icon
                name='rank-profile'
                width={80}
                height={80}
                className='rank__rankers__ranker--image'
              />
              <div className='rank__rankers__ranker--nickname'>사용자 1</div>
              <div className='rank__rankers__ranker--score'>누적 200P</div>
            </div>
            <div className='rank__rankers__ranker ranker-third'>
              <Icon
                name='rank-profile'
                width={80}
                height={80}
                className='rank__rankers__ranker--image'
              />
              <div className='rank__rankers__ranker--nickname'>사용자 3</div>
              <div className='rank__rankers__ranker--score'>누적 50P</div>
            </div>
          </div>
          <Icon name='rank-stage' width={320} className='rank__stage' />
        </section>
      </section>

      <section className='rank__myrank'>
        <div className='rank__myrank__title'>내 순위</div>
        <section className='rank__myrank__content'></section>
      </section>
    </div>
  )
}

export default RankingPage
