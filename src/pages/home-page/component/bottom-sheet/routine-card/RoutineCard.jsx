import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { claimRoutinePoint } from '../../../../../api/pointApi'

import './RoutineCard.css'

function RoutineCard({ routine, onReceivePoint, onEdit }) {
  const navigate = useNavigate()

  const claimingRef = useRef(false)

  const [isClaiming, setIsClaiming] = useState(false)
  const [claimedLocally, setClaimedLocally] = useState(false)

  const {
    category,
    title,
    theme,
    characterImage,
    isCompleted,
    rewardPoint,
    dailyRoutineId,
    routineId,
    pointClaim,
  } = routine

  const isPointClaimed = Boolean(pointClaim?.claimed) || claimedLocally
  const isPointClaimable = Boolean(pointClaim?.claimable) && !isPointClaimed

  const handleVerificationClick = (event) => {
    event.stopPropagation()

    if (isCompleted) return

    navigate('/verification', {
      state: {
        routine,
      },
    })
  }

  const handleEditClick = () => {
    if (!routineId) {
      alert('수정할 루틴 정보를 찾지 못했습니다.')
      return
    }

    onEdit?.(routine)
  }

  const handlePointClaim = async (event) => {
    event.stopPropagation()

    if (!dailyRoutineId || !isPointClaimable || claimingRef.current) {
      return
    }

    claimingRef.current = true
    setIsClaiming(true)

    try {
      const result = await claimRoutinePoint(dailyRoutineId)
      const awardedPoints = result?.awardedPoints ?? rewardPoint

      setClaimedLocally(true)
      onReceivePoint?.(awardedPoints)
    } catch (error) {
      console.error('포인트 수령 실패:', error)

      if (error.code === 'POINT_ALREADY_CLAIMED') {
        setClaimedLocally(true)
        return
      }

      alert(error.message ?? '포인트를 받지 못했습니다.')
    } finally {
      claimingRef.current = false
      setIsClaiming(false)
    }
  }

  const getPointButtonText = () => {
    if (isClaiming) return '받는 중...'
    if (isPointClaimed) return `${rewardPoint}P 받음`
    if (!isPointClaimable) return '수령 불가'

    return `${rewardPoint}P 받기`
  }

  return (
    <article
      className={`routineCard routineCard--${theme} ${isCompleted ? 'routineCard--completed' : ''}`}
      onClick={handleEditClick}
    >
      <button
        type='button'
        className={`routineCard__check ${isCompleted ? 'routineCard__check--completed' : ''}`}
        aria-label={`${title} 루틴 인증하기`}
        disabled={isCompleted}
        onClick={handleVerificationClick}
      />

      <div className='routineCard__text'>
        <span className='routineCard__category'>{category}</span>
        <span className='routineCard__title'>{title}</span>
      </div>

      {isCompleted ? (
        <button
          type='button'
          className={`routineCard__reward-button ${
            isPointClaimed || !isPointClaimable ? 'routineCard__reward-button--claimed' : ''
          }`}
          disabled={isPointClaimed || !isPointClaimable || isClaiming}
          onClick={handlePointClaim}
        >
          {getPointButtonText()}
        </button>
      ) : (
        <img src={characterImage} alt={`${category} 캐릭터`} className='routineCard__character' />
      )}
    </article>
  )
}

export default RoutineCard
