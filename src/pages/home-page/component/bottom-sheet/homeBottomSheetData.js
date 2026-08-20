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

  const pointClaim = dailyRoutine.pointClaim ?? homeRoutine?.pointClaim ?? null

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

    pointClaim,

    rewardPoint: pointClaim?.rewardPoints ?? (verificationType === 'PHOTO' ? 10 : 5),
  }
}

export function createTodoCardData(dailyRoutine, serviceDate) {
  return {
    id: dailyRoutine.id,
    dailyRoutineId: dailyRoutine.id,
    routineId: dailyRoutine.routineId,

    categoryCode: 'TO_DO',
    category: 'To-do',
    content: dailyRoutine.content,
    theme: 'wellbeing',
    characterImage: imageWellbeing,

    time: dailyRoutine.startTime ?? '시간 미지정',
    title: dailyRoutine.content,

    scheduledDate: dailyRoutine.scheduledDate ?? serviceDate ?? '',
    startTime: dailyRoutine.startTime,
    endTime: dailyRoutine.endTime,

    status: dailyRoutine.status,
    isCompleted: dailyRoutine.status === 'COMPLETED',

    verificationType: dailyRoutine.verification?.type ?? 'CHECK',
    verificationObject: dailyRoutine.verificationObject,
  }
}

export function createRecommendedRoutineCardData(recommendation) {
  const categoryMeta = CATEGORY_META[recommendation.category] ?? DEFAULT_CATEGORY_META

  return {
    id: recommendation.code,
    code: recommendation.code,

    categoryCode: recommendation.category,
    category: categoryMeta.label,

    content: recommendation.content,
    title: recommendation.content,

    theme: categoryMeta.theme,
    characterImage: categoryMeta.characterImage,

    recommendedVerificationObject: recommendation.recommendedVerificationObject,
  }
}

export const TIMELINE_IMAGES = {
  sun: imageSun,
  moon: imageMoon,
}
