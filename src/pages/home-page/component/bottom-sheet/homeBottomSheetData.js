import imageDiet from '../../../../assets/home-bottom-sheet/character/image-diet.svg'
import imageHealth from '../../../../assets/home-bottom-sheet/character/image-health.svg'
import imageSkin from '../../../../assets/home-bottom-sheet/character/image-skin.svg'
import imageWellbeing from '../../../../assets/home-bottom-sheet/character/image-wellbeing.svg'

import imageMoon from '../../../../assets/home-bottom-sheet/image-moon.svg'
import imageSun from '../../../../assets/home-bottom-sheet/image-sun.svg'

const CATEGORY_META = {
  SKIN: {
    label: 'Skin',
    theme: 'skin',
    characterImage: imageSkin,
  },
  WELL_BEING: {
    label: 'Well-being',
    theme: 'wellbeing',
    characterImage: imageWellbeing,
  },
  HEALTH_FIT: {
    label: 'Health & Fit',
    theme: 'health',
    characterImage: imageHealth,
  },
  DIET: {
    label: 'Diet',
    theme: 'diet',
    characterImage: imageDiet,
  },
}

const DEFAULT_CATEGORY_META = {
  label: 'Routine',
  theme: 'wellbeing',
  characterImage: imageWellbeing,
}

export function createRoutineCardData(dailyRoutine, homeRoutine) {
  const categoryMeta = CATEGORY_META[dailyRoutine.category] ?? DEFAULT_CATEGORY_META

  const verificationType =
    homeRoutine?.verificationType ?? dailyRoutine.verification?.type ?? 'CHECK'

  return {
    id: dailyRoutine.id,
    dailyRoutineId: dailyRoutine.id,
    routineId: dailyRoutine.routineId,

    categoryCode: dailyRoutine.category,
    category: categoryMeta.label,
    title: dailyRoutine.content,
    theme: categoryMeta.theme,
    characterImage: categoryMeta.characterImage,

    startTime: dailyRoutine.startTime,
    endTime: dailyRoutine.endTime,
    status: dailyRoutine.status,
    isCompleted: dailyRoutine.status === 'COMPLETED',

    verificationType,
    verificationObject: dailyRoutine.verificationObject,

    pointClaim: dailyRoutine.pointClaim ?? null,

    rewardPoint: dailyRoutine.pointClaim?.rewardPoints ?? (verificationType === 'PHOTO' ? 10 : 5),
  }
}

export function createTodoCardData(dailyRoutine) {
  return {
    id: dailyRoutine.id,
    dailyRoutineId: dailyRoutine.id,
    routineId: dailyRoutine.routineId,

    time: dailyRoutine.startTime ?? '시간 미지정',
    title: dailyRoutine.content,

    status: dailyRoutine.status,
    isCompleted: dailyRoutine.status === 'COMPLETED',

    verificationObject: dailyRoutine.verificationObject,
  }
}

/*
 * 추천 루틴은 다음 단계에서 API 데이터로 교체한다.
 */
export const RECOMMENDED_ROUTINES = [
  {
    id: 1,
    category: 'Skin',
    title: '외출 전 선크림 바르기',
    theme: 'skin',
    characterImage: imageSkin,
  },
  {
    id: 2,
    category: 'Well-being',
    title: '잠들기 전 명상하기',
    theme: 'wellbeing',
    characterImage: imageWellbeing,
  },
  {
    id: 3,
    category: 'Diet',
    title: '하루 물 2L 마시기',
    theme: 'diet',
    characterImage: imageDiet,
  },
  {
    id: 4,
    category: 'Health & Fit',
    title: '가볍게 스트레칭하기',
    theme: 'health',
    characterImage: imageHealth,
  },
]

export const TIMELINE_IMAGES = {
  sun: imageSun,
  moon: imageMoon,
}
