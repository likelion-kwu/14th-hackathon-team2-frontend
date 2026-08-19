import imageDiet from '../../../../assets/home-bottom-sheet/character/image-diet.svg'
import imageHealth from '../../../../assets/home-bottom-sheet/character/image-health.svg'
import imageSkin from '../../../../assets/home-bottom-sheet/character/image-skin.svg'
import imageWellbeing from '../../../../assets/home-bottom-sheet/character/image-wellbeing.svg'
import imageMoon from '../../../../assets/home-bottom-sheet/image-moon.svg'
import imageSun from '../../../../assets/home-bottom-sheet/image-sun.svg'

export const ROUTINES = [
  {
    id: 1,
    category: 'Skin',
    title: '텍스트',
    theme: 'skin',
    characterImage: imageSkin,
    isCompleted: false,
    rewardPoint: 5,
  },
  {
    id: 2,
    category: 'Well-being',
    title: '텍스트',
    theme: 'wellbeing',
    characterImage: imageWellbeing,
    isCompleted: false,
    rewardPoint: 5,
  },
  {
    id: 3,
    category: 'Diet',
    title: '텍스트',
    theme: 'diet',
    characterImage: imageDiet,
    isCompleted: false,
    rewardPoint: 10,
  },
  {
    id: 4,
    category: 'Skin',
    title: '텍스트',
    theme: 'skin',
    characterImage: imageSkin,
    isCompleted: false,
    rewardPoint: 5,
  },
  {
    id: 5,
    category: 'Health & Fit',
    title: '텍스트',
    theme: 'health',
    characterImage: imageHealth,
    isCompleted: false,
    rewardPoint: 10,
  },
]

export const TODO_ROUTINES = [
  {
    id: 1,
    time: '00:00',
    title: '텍스트',
    isCompleted: false,
    rewardPoint: 5,
  },
  {
    id: 2,
    time: '시간 미지정',
    title: '텍스트',
    isCompleted: false,
    rewardPoint: 5,
  },
]

export const RECOMMENDED_ROUTINES = [
  {
    id: 1,
    category: 'Skin',
    title: '텍스트',
    theme: 'skin',
    characterImage: imageSkin,
  },
  {
    id: 2,
    category: 'Well-being',
    title: '텍스트',
    theme: 'wellbeing',
    characterImage: imageWellbeing,
  },
  {
    id: 3,
    category: 'Diet',
    title: '텍스트',
    theme: 'diet',
    characterImage: imageDiet,
  },
  {
    id: 4,
    category: 'Health & Fit',
    title: '텍스트',
    theme: 'health',
    characterImage: imageHealth,
  },
]

export const TIMELINE_IMAGES = {
  sun: imageSun,
  moon: imageMoon,
}
