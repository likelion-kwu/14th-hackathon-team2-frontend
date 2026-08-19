import { useLocation, useNavigate } from 'react-router-dom'

import { Icon } from '../../icon/Icon'

import './Navigation.css'

function Navigation({ isRoutinePlusOpen, onRoutinePlusClick, onNavigate }) {
  const navigate = useNavigate()
  const location = useLocation()

  const navigationItems = [
    {
      key: 'home',
      path: '/home',
      activeIcon: 'navigation-home-active',
      disabledIcon: 'navigation-home-disabled',
    },
    {
      key: 'reflection',
      path: '/reflection',
      activeIcon: 'navigation-reflec-active',
      disabledIcon: 'navigation-reflec-disabled',
    },
    {
      key: 'routine-plus',
      type: 'popup',
      activeIcon: 'navigation-routine-active',
      disabledIcon: 'navigation-routine-disabled',
    },
    {
      key: 'ranking',
      path: '/ranking',
      activeIcon: 'navigation-rank-active',
      disabledIcon: 'navigation-rank-disabled',
    },
    {
      key: 'customize',
      path: '/customize',
      activePaths: ['/customize', '/setting'],
      activeIcon: 'navigation-custom-active',
      disabledIcon: 'navigation-custom-disabled',
    },
  ]

  const handleNavigationClick = (item) => {
    if (item.type === 'popup') {
      onRoutinePlusClick()
      return
    }

    onNavigate()
    navigate(item.path)
  }

  return (
    <div className='navigation__page'>
      <nav className='navigation__container'>
        {navigationItems.map((item) => {
          const isPopupButton = item.type === 'popup'

          const isActive = isPopupButton ? isRoutinePlusOpen : location.pathname === item.path

          return (
            <button
              key={item.key}
              type='button'
              className='navigation__button'
              aria-label={isPopupButton ? '루틴 추가 팝업 열기' : `${item.key} 화면으로 이동`}
              aria-pressed={isPopupButton ? isRoutinePlusOpen : undefined}
              onClick={() => handleNavigationClick(item)}
            >
              <Icon name={isActive ? item.activeIcon : item.disabledIcon} width={24} height={24} />
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default Navigation
