import { useEffect, useState } from 'react'

import { getCompetitionLeaderboard } from '../../../api/competitionApi'
import { Icon } from '../../../components/icon/Icon'

import './RankingPage.css'

function getCurrentMonth() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')

  return `${year}-${month}`
}

function getMonthLabel(monthValue) {
  if (!monthValue) return ''

  const [year, month] = monthValue.split('-')

  return `${year}년 ${Number(month)}월 기준`
}

function RankingPage() {
  const [competitionMonth] = useState(getCurrentMonth)

  const [leaderboard, setLeaderboard] = useState({
    month: '',
    ranking: [],
    myRank: null,
    myEarnedPoints: 0,
  })

  const [isLoading, setIsLoading] = useState(false)

  const [rankingError, setRankingError] = useState('')

  useEffect(() => {
    let isCancelled = false

    const loadLeaderboard = async () => {
      setIsLoading(true)
      setRankingError('')

      try {
        const result = await getCompetitionLeaderboard(competitionMonth)

        if (isCancelled) return

        setLeaderboard({
          month: result?.month ?? competitionMonth,
          ranking: result?.ranking ?? [],
          myRank: result?.myRank ?? null,
          myEarnedPoints: result?.myEarnedPoints ?? 0,
        })
      } catch (error) {
        console.error('리더보드를 불러오지 못했습니다.', error)

        if (isCancelled) return

        setRankingError(error.message ?? '리더보드를 불러오지 못했습니다.')
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadLeaderboard()

    return () => {
      isCancelled = true
    }
  }, [competitionMonth])

  const ranking = leaderboard.ranking

  const podiumRankers = [
    {
      position: 'second',
      className: 'ranker-second',
      ranker: ranking[1],
    },
    {
      position: 'first',
      className: 'ranker-first',
      ranker: ranking[0],
    },
    {
      position: 'third',
      className: 'ranker-third',
      ranker: ranking[2],
    },
  ]

  const myRankingData = ranking.find((ranker) => ranker.me)

  const myRank = leaderboard.myRank ?? myRankingData?.rank ?? '-'

  const myNickname = myRankingData?.nickname ?? '나'

  const myEarnedPoints = leaderboard.myEarnedPoints ?? myRankingData?.earnedPoints ?? 0

  return (
    <div className='rank__container'>
      <div className='rank__title'>경쟁하기</div>

      <section className='rank__board'>
        <div className='rank__board__title'>리더보드</div>

        <section className='rank__board__content'>
          {rankingError && <p className='rank__message rank__message--error'>{rankingError}</p>}

          {isLoading && <p className='rank__message'>순위를 불러오는 중...</p>}

          <div className={`rank__rankers ${isLoading ? 'rank__rankers--loading' : ''}`}>
            {podiumRankers.map(({ position, className, ranker }) => (
              <div key={position} className={`rank__rankers__ranker ${className}`}>
                <Icon
                  name='rank-profile'
                  width={80}
                  height={80}
                  className='rank__rankers__ranker--image'
                />

                <div className='rank__rankers__ranker--nickname'>
                  {ranker?.nickname ?? '아직 없음'}
                </div>

                <div className='rank__rankers__ranker--score'>
                  {ranker ? `이번 달 ${ranker.earnedPoints}P` : '-'}
                </div>
              </div>
            ))}
          </div>

          <div className='rank__content--bottom'>
            <Icon name='rank-stage' width={320} className='rank__stage' />

            <div className='rank__date'>{getMonthLabel(leaderboard.month || competitionMonth)}</div>
          </div>
        </section>
      </section>

      <section className='rank__myrank'>
        <div className='rank__myrank__title'>내 순위</div>

        <section className='rank__myrank__content'>
          <div className='rank__myrank__rank'>
            <div className='rank__myrank__number'>{myRank}</div>

            <div className='rank__myrank__nickname'>{myNickname}</div>
          </div>

          <div className='rank__myrank__score'>이번 달 {myEarnedPoints}P</div>
        </section>
      </section>
    </div>
  )
}

export default RankingPage
